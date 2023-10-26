import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import { UniswapProtocolConfig } from '../../../configs/protocols/uniswap';
import { compareAddress, normalizeAddress } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions } from '../../../types/options';
import Adapter from '../adapter';
import { UniswapAbiMappings, UniswapEventSignatures } from './abis';
import { UniswapLiquidityPoolConstant, UniswapPoolVersion } from './domains';
import UniswapLibs from './libs';

export default class UniswapAdapter extends Adapter {
  public readonly name: string = 'adapter.uniswap';
  public readonly config: UniswapProtocolConfig;

  constructor(services: ContextServices, config: UniswapProtocolConfig) {
    super(services, {
      protocol: config.protocol,
      contracts: config.contracts,
    });

    this.config = config;
  }

  protected async getLiquidityPool(
    chain: string,
    address: string,
    version: UniswapPoolVersion,
  ): Promise<UniswapLiquidityPoolConstant | null> {
    const pool = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.liquidityPools,
      query: {
        chain: chain,
        address: normalizeAddress(address),
      },
    });

    if (pool) {
      return pool as UniswapLiquidityPoolConstant;
    }

    // get on-chain data
    return await UniswapLibs.getLiquidityPoolOnchain({
      chain: chain,
      address: address,
      version: version,
      protocol: this.config.protocol,
    });
  }

  protected haveFactoryAddress(chain: string, factoryAddress: string): boolean {
    for (const factory of this.config.factories) {
      if (compareAddress(factory.address, factoryAddress)) {
        return true;
      }
    }

    return false;
  }

  protected async parseCreateLiquidityPoolEvent(
    options: HandleHookEventLogOptions,
    version: UniswapPoolVersion,
  ): Promise<UniswapLiquidityPoolConstant | null> {
    const signature = options.log.topics[0];

    if (this.haveFactoryAddress(options.chain, options.log.address)) {
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
        };
      }
    }

    return null;
  }

  protected async handleHookEventLogCreateLiquidityPool(
    options: HandleHookEventLogOptions,
    version: UniswapPoolVersion,
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
