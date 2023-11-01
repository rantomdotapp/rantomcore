import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { ProtocolConfig } from '../../../types/configs';
import { LiquidityPoolConstant, LiquidityPoolVersion } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions } from '../../../types/options';
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
  }

  /**
   * @description check a liquidity pool contract is belong to this protocol or not
   * by getting event from a liquidity pool, we can know which protocol it was owned
   * by checking the factory address of that liquidity pool contract
   */
  protected async getLiquidityPool(
    chain: string,
    address: string,
    version: LiquidityPoolVersion,
  ): Promise<LiquidityPoolConstant | null> {
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
}
