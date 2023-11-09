import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import logger from '../../../lib/logger';
import { normalizeAddress } from '../../../lib/utils';
import { formatFromDecimals } from '../../../lib/utils';
import { ProtocolConfig } from '../../../types/configs';
import { LiquidityPoolConstant, TransactionAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions, ParseEventLogOptions } from '../../../types/options';
import Traderjoev2ApiUpdater from '../../updaters/traderjoeApi';
import Adapter from '../adapter';
import { Traderjoev2AbiMappings, Traderjoev2EventSignatures } from './abis';

export default class Traderjoev2Adapter extends Adapter {
  public readonly name: string = 'adapter.traderjoev2';
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, {
      protocol: config.protocol,
      contracts: config.contracts,
    });

    this.config = config;
    this.eventMappings = Traderjoev2AbiMappings;

    this.updaters = [new Traderjoev2ApiUpdater(services, config)];
  }

  protected async getPool(chain: string, address: string): Promise<LiquidityPoolConstant | null> {
    // firstly, we try to get liquidity pool info from database
    // should get a LiquidityPoolConstant object
    const pool = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.liquidityPools,
      query: {
        chain: chain,
        address: normalizeAddress(address),
      },
    });

    if (pool) {
      return pool as LiquidityPoolConstant;
    }

    return null;
  }

  public async handleEventLog(options: HandleHookEventLogOptions) {
    const signature = options.log.topics[0];
    if (signature === Traderjoev2EventSignatures.LBPairCreated) {
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        this.eventMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );

      const token0 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.tokenX,
      });
      const token1 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.tokenY,
      });

      if (token0 && token1) {
        const liquidityPool: LiquidityPoolConstant = {
          chain: options.chain,
          protocol: this.config.protocol,
          version: 'traderjoev2.1',
          address: normalizeAddress(event.LBPair),
          factory: normalizeAddress(options.log.event),
          token0: token0,
          token1: token1,
          fee: 0,
          createdBlockNumber: Number(options.log.blockNumber),
        };

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
          version: liquidityPool.version,
        });
      }
    }
  }

  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    const actions: Array<TransactionAction> = [];

    const pool = await this.getPool(options.chain, options.log.address);
    if (pool) {
      const signature = options.log.topics[0];
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        this.eventMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );

      switch (signature) {
        case Traderjoev2EventSignatures.Swap: {
          const amount1In = new BigNumber(event.amountsIn.slice(2).slice(0, 32), 16);
          const amount0In = new BigNumber(event.amountsIn.slice(2).slice(-32), 16);
          const amount1Out = new BigNumber(event.amountsOut.slice(2).slice(0, 32), 16);
          const amount0Out = new BigNumber(event.amountsOut.slice(2).slice(-32), 16);
          const protocolFees = new BigNumber(event.protocolFees.toString(), 16);

          const tokenIn = amount0In.gt(0) ? pool.token0 : pool.token1;
          const tokenOut = amount0In.gt(0) ? pool.token1 : pool.token0;
          const amountIn = formatFromDecimals(
            amount0In.gt(0) ? amount0In.plus(protocolFees).toString(10) : amount1In.plus(protocolFees).toString(10),
            tokenIn.decimals,
          );
          const amountOut = formatFromDecimals(
            amount0In.gt(0) ? amount1Out.toString(10) : amount0Out.toString(10),
            tokenOut.decimals,
          );

          const sender = normalizeAddress(event.sender);
          const to = normalizeAddress(event.to);

          actions.push(
            this.buildUpAction({
              ...options,
              action: 'swap',
              addresses: [sender, to],
              tokens: [tokenIn, tokenOut],
              tokenAmounts: [amountIn, amountOut],
            }),
          );

          break;
        }
        case Traderjoev2EventSignatures.DepositedToBins:
        case Traderjoev2EventSignatures.WithdrawnFromBins: {
          let amount0 = new BigNumber(0);
          let amount1 = new BigNumber(0);
          for (const amount of event.amounts) {
            amount0 = amount0.plus(new BigNumber(amount.slice(2).slice(-32), 16));
            amount1 = amount1.plus(new BigNumber(amount.slice(2).slice(0, 32), 16));
          }

          const sender = normalizeAddress(event.sender);
          const to = normalizeAddress(event.to);

          actions.push(
            this.buildUpAction({
              ...options,
              action: signature === Traderjoev2EventSignatures.DepositedToBins ? 'deposit' : 'withdraw',
              addresses: [sender, to],
              tokens: [pool.token0, pool.token1],
              tokenAmounts: [
                formatFromDecimals(amount0.toString(10), pool.token0.decimals),
                formatFromDecimals(amount1.toString(10), pool.token1.decimals),
              ],
            }),
          );

          break;
        }
        case Traderjoev2EventSignatures.FlashLoan: {
          const amount0 = new BigNumber(event.amounts.slice(2).slice(-32), 16);
          const amount1 = new BigNumber(event.amounts.slice(2).slice(0, 32), 16);

          const sender = normalizeAddress(event.sender);
          const receiver = normalizeAddress(event.receiver);

          actions.push(
            this.buildUpAction({
              ...options,
              action: 'flashloan',
              addresses: [sender, receiver],
              tokens: [pool.token0, pool.token1],
              tokenAmounts: [
                formatFromDecimals(amount0.toString(10), pool.token0.decimals),
                formatFromDecimals(amount1.toString(10), pool.token1.decimals),
              ],
            }),
          );
        }
      }
    }

    return actions;
  }
}
