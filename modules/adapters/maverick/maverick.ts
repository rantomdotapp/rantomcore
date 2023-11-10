import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import logger from '../../../lib/logger';
import { normalizeAddress } from '../../../lib/utils';
import { formatFromDecimals } from '../../../lib/utils';
import { ProtocolConfig } from '../../../types/configs';
import { KnownAction, LiquidityPoolConstant, LiquidityPoolVersion, TransactionAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions, ParseEventLogOptions } from '../../../types/options';
import MaverickFactoryUpdater from '../../updaters/maverickFactory';
import Adapter from '../adapter';
import { MaverickAbiMappings, MaverickEventSignatures } from './abis';

export default class MaverickAdapter extends Adapter {
  public readonly name: string = 'adapter.maverick';
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, {
      protocol: config.protocol,
      contracts: config.contracts,
    });

    this.config = config;
    this.eventMappings = MaverickAbiMappings;

    this.updaters = [new MaverickFactoryUpdater(services, config)];
  }

  /**
   * @description parse a raw contract log entry to LiquidityPoolConstant
   * every uniswap or fork protocol have a list of factory contracts where liquidity pool were created
   * this function take a raw log entry (liquidity pool created event signature)
   * and parse it into an LiquidityPoolConstant structure
   * it supports maverick PoolCreated event
   *
   * @param options includes a given chain name and raw log entry
   * @param version it should be mav
   *
   * @return LiquidityPoolConstant on valid event, otherwise, return null
   */
  protected async parseCreateLiquidityPoolEvent(
    options: HandleHookEventLogOptions,
    version: LiquidityPoolVersion,
  ): Promise<LiquidityPoolConstant | null> {
    const signature = options.log.topics[0];

    if (this.supportedContract(options.chain, options.log.address)) {
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        MaverickAbiMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );
      const poolAddress = normalizeAddress(event.poolAddress);
      const token0 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.tokenA,
      });
      const token1 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.tokenB,
      });

      if (token0 && token1) {
        return {
          chain: options.chain,
          address: poolAddress,
          protocol: this.config.protocol,
          version: version,
          factory: normalizeAddress(options.log.address),
          fee: new BigNumber(event.fee.toString()).dividedBy(1e16).toNumber(),
          token0,
          token1,
          createdBlockNumber: Number(options.log.blockNumber),
        };
      }
    }

    return null;
  }

  /**
   * @description save a new liquidity pool info into database on created event on factory contract
   * this function is compatible with Uniswap v2 factory contract only!
   *
   * @param options includes a chain name and raw log entry
   */
  public async handleEventLog(options: HandleHookEventLogOptions): Promise<void> {
    const signature = options.log.topics[0];
    if (signature === MaverickEventSignatures.PoolCreated) {
      const liquidityPool = await this.parseCreateLiquidityPoolEvent(options, 'mav');
      if (liquidityPool) {
        await this.services.database.update({
          collection: EnvConfig.mongodb.collections.liquidityPools,
          keys: {
            chain: liquidityPool.chain,
            address: liquidityPool.address,
          },
          updates: {
            ...liquidityPool,
          },
          upsert: true,
        });

        logger.info('updated liquidity pool', {
          service: this.name,
          protocol: this.config.protocol,
          chain: liquidityPool.chain,
          address: liquidityPool.address,
          version: 'mav',
        });
      }
    }
  }

  /**
   * @description turns a raw event log into TransactionActions
   *
   * @param options include raw log entry and transaction context
   */
  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    const actions: Array<TransactionAction> = [];

    const signature = options.log.topics[0];
    if (!this.eventMappings[signature]) {
      return actions;
    }

    const liquidityPool: LiquidityPoolConstant | null = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.liquidityPools,
      query: {
        chain: options.chain,
        address: normalizeAddress(options.log.address),
      },
    });
    if (liquidityPool && this.supportedContract(options.chain, liquidityPool.factory)) {
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        this.eventMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );

      switch (signature) {
        case MaverickEventSignatures.Swap: {
          const tokenAIn = Boolean(event.tokenAIn);

          let tokenIn;
          let tokenOut;
          if (tokenAIn) {
            tokenIn = liquidityPool.token0;
            tokenOut = liquidityPool.token1;
          } else {
            tokenIn = liquidityPool.token1;
            tokenOut = liquidityPool.token0;
          }

          const amountIn = formatFromDecimals(event.amountIn.toString(), tokenIn.decimals);
          const amountOut = formatFromDecimals(event.amountOut.toString(), tokenOut.decimals);
          const sender = normalizeAddress(event.sender);
          const recipient = normalizeAddress(event.recipient);

          actions.push({
            chain: options.chain,
            protocol: this.config.protocol,
            action: 'swap',
            transactionHash: options.log.transactionHash,
            logIndex: `${options.log.logIndex}:0`,
            blockNumber: Number(options.log.blockNumber),
            contract: normalizeAddress(options.log.address),
            addresses: [sender, recipient],
            tokens: [tokenIn, tokenOut],
            tokenAmounts: [amountIn, amountOut],
          });
          break;
        }
        case MaverickEventSignatures.AddLiquidity:
        case MaverickEventSignatures.RemoveLiquidity: {
          let amountA = new BigNumber(0);
          let amountB = new BigNumber(0);
          const binDeltas = event.binDeltas as unknown as Array<any>;
          for (const binDelta of binDeltas) {
            amountA = amountA.plus(new BigNumber(binDelta.deltaA.toString()).dividedBy(1e18));
            amountB = amountB.plus(new BigNumber(binDelta.deltaB.toString()).dividedBy(1e18));
          }

          const sender = normalizeAddress(event.sender);
          const recipient = event.recipient ? normalizeAddress(event.recipient) : sender;
          const action: KnownAction = signature === MaverickEventSignatures.AddLiquidity ? 'deposit' : 'withdraw';

          actions.push({
            chain: options.chain,
            protocol: this.config.protocol,
            action: action,
            transactionHash: options.log.transactionHash,
            logIndex: `${options.log.logIndex}:0`,
            blockNumber: Number(options.log.blockNumber),
            contract: normalizeAddress(options.log.address),
            addresses: [sender, recipient],
            tokens: [liquidityPool.token0, liquidityPool.token1],
            tokenAmounts: [amountA.toString(10), amountB.toString(10)],
          });
          break;
        }
      }
    }

    return actions;
  }
}
