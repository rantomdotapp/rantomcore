import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { ProtocolConfig } from '../../../types/configs';
import { LiquidityPoolConstant, LiquidityPoolVersion } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions } from '../../../types/options';
import Adapter from '../adapter';
import { UniswapAbiMappings, UniswapEventSignatures } from './abis';
import UniswapLibs from './libs';

export default class UniswapAdapter extends Adapter {
  public readonly name: string = 'adapter.uniswap';
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

    // if we can not find the liquidity pool in database
    // we try to get on-chain data
    return await UniswapLibs.getLiquidityPoolOnchain({
      chain: chain,
      address: address,
      version: version,
      protocol: this.config.protocol,
    });
  }

  /**
   * @description parse a raw contract log entry to UniswapLiquidityPoolConstant
   * every uniswap or fork protocol have a list of factory contracts where liquidity pool were created
   * this function take a raw log entry (liquidity pool created event signature)
   * and parse it into an UniswapLiquidityPoolConstant structure
   * it supports Uniswap v2, Uniswap v3
   *
   * @param options includes a given chain name and raw log entry
   * @param version it should be univ2 or univ3
   *
   * @return UniswapLiquidityPoolConstant on valid event, otherwise, return null
   */
  protected async parseCreateLiquidityPoolEvent(
    options: HandleHookEventLogOptions,
    version: LiquidityPoolVersion,
  ): Promise<LiquidityPoolConstant | null> {
    const signature = options.log.topics[0];

    if (this.supportedContract(options.chain, options.log.address)) {
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        UniswapAbiMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );
      const poolAddress = normalizeAddress(event.pair ? event.pair : event.pool);
      const token0 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.token0,
      });
      const token1 = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: event.token1,
      });

      if (token0 && token1) {
        return {
          chain: options.chain,
          address: poolAddress,
          protocol: this.config.protocol,
          version: version,
          factory: normalizeAddress(options.log.address),
          fee: version === 'univ2' ? 0.3 : new BigNumber(event.fee.toString()).dividedBy(1e4).toNumber(),
          token0,
          token1,
          createdBlockNumber: Number(options.log.blockNumber),
        };
      }
    }

    return null;
  }

  /**
   * @description handle a raw log event which is liquidity pool created event on factory contract
   *
   * @param options includes a chain name and raw log entry
   * @param version should be univ2 or univ3
   */
  protected async handleEventLogCreateLiquidityPool(
    options: HandleHookEventLogOptions,
    version: LiquidityPoolVersion,
  ): Promise<void> {
    const signature = options.log.topics[0];
    if (signature === UniswapEventSignatures.PairCreated || signature === UniswapEventSignatures.PoolCreated) {
      const liquidityPool = await this.parseCreateLiquidityPoolEvent(options, version);
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
          version: version,
        });
      }
    }
  }
}
