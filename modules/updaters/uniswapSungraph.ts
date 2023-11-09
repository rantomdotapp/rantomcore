import BigNumber from 'bignumber.js';

import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { querySubgraph } from '../../lib/subsgraph';
import { normalizeAddress, sleep } from '../../lib/utils';
import { ProtocolConfig, SubgraphConfig } from '../../types/configs';
import { LiquidityPoolConstant, LiquidityPoolVersion } from '../../types/domains';
import { ContextServices } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';
import Updater from './updater';

// uniswap subgraph helps to index liquidity pairs data from subgraph
// we can index pairs data from factory events, but it was cost
// we can use subgraph for faster indexing
export default class UniswapSubgraphUpdater extends Updater {
  public readonly name: string = 'updater.uniswapSubgraph';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  // some protocol subgraph use difference field names
  // so in that protocols, we just need to extend this class
  // and override this function
  protected subgraphGetFieldNames(config: SubgraphConfig): any {
    return {
      factories: config.version === 'univ2' ? 'uniswapFactories' : 'factories',
      listPools: config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: config.version === 'univ2' ? '' : 'feeTier',
      createdAtBlockNumber: 'createdAtBlockNumber',
    };
  }

  // get factory address
  protected async subgraphGetFactoryAddress(config: SubgraphConfig): Promise<string | null> {
    const fieldNames = this.subgraphGetFieldNames(config);
    const data = await querySubgraph(
      config.endpoint,
      `
			{
        factories: ${fieldNames.factories}(first: 1) {
			    id
			  }
      }
		`,
      config.requestOptions ? config.requestOptions : {},
    );

    return data ? normalizeAddress(data.factories[0].id) : null;
  }

  protected async subgraphGetPoolList(config: SubgraphConfig, latestPoolId: string | null): Promise<Array<any>> {
    const fieldNames = this.subgraphGetFieldNames(config);
    const data = await querySubgraph(
      config.endpoint,
      `
  		{
        pools: ${fieldNames.listPools}(first: 1000 ${latestPoolId ? `where: {id_gt: "${latestPoolId}"}` : ''}) {
          id
          token0{
            id
            symbol
            decimals
          }
          token1{
            id
            symbol
            decimals
          }
          ${fieldNames.poolFee}
          ${fieldNames.createdAtBlockNumber}
        }
      }
  	`,
      config.requestOptions ? config.requestOptions : {},
    );
    return data ? data.pools : [];
  }

  protected transformLiquidityPools(
    factoryAddress: string,
    config: SubgraphConfig,
    subgraphPools: Array<any>,
  ): Array<LiquidityPoolConstant> {
    const fieldNames = this.subgraphGetFieldNames(config);
    const pools: Array<LiquidityPoolConstant> = [];
    for (const pool of subgraphPools) {
      pools.push({
        chain: config.chain,
        version: config.version as LiquidityPoolVersion,
        protocol: config.protocol,
        address: normalizeAddress(pool.id),
        token0: {
          chain: config.chain,
          address: normalizeAddress(pool.token0.id),
          symbol: pool.token0.symbol,
          decimals: Number(pool.token0.decimals),
        },
        token1: {
          chain: config.chain,
          address: normalizeAddress(pool.token1.id),
          symbol: pool.token1.symbol,
          decimals: Number(pool.token1.decimals),
        },
        factory: factoryAddress,
        fee: config.version === 'univ2' ? 0.3 : new BigNumber(pool[fieldNames.poolFee]).dividedBy(1e4).toNumber(),
        createdBlockNumber: Number(pool[fieldNames.createdAtBlockNumber]),
      });
    }

    return pools;
  }

  protected async indexSubgraphHistoricalData(subgraphConfig: SubgraphConfig): Promise<void> {
    const factoryAddress = await this.subgraphGetFactoryAddress(subgraphConfig);
    if (factoryAddress) {
      logger.info('start index liquidity pools data from subgraph', {
        service: this.name,
        chain: subgraphConfig.chain,
        protocol: subgraphConfig.protocol,
        version: subgraphConfig.version,
        factory: normalizeAddress(factoryAddress),
        endpoint: subgraphConfig.endpoint,
      });

      let latestPoolId: string | null = null;

      const stateKey = `indexing-subgraph-${subgraphConfig.chain}-${this.config.protocol}-${subgraphConfig.version}`;
      const state = await this.services.database.find({
        collection: EnvConfig.mongodb.collections.states,
        query: {
          name: stateKey,
        },
      });
      if (state) {
        latestPoolId = state.latestPoolId;
      }

      do {
        const startExeTime = Math.floor(new Date().getTime() / 1000);

        const subgraphPoolsData = await this.subgraphGetPoolList(subgraphConfig, latestPoolId);
        const pools: Array<LiquidityPoolConstant> = this.transformLiquidityPools(
          factoryAddress,
          subgraphConfig,
          subgraphPoolsData,
        );

        const operations: Array<any> = [];
        for (const pool of pools) {
          operations.push({
            updateOne: {
              filter: {
                chain: pool.chain,
                address: pool.address,
              },
              update: {
                $set: {
                  ...pool,
                },
              },
              upsert: true,
            },
          });

          // we also update tokens too
          await this.services.database.update({
            collection: EnvConfig.mongodb.collections.tokens,
            keys: {
              chain: pool.chain,
              address: pool.token0.address,
            },
            updates: {
              ...pool.token0,
            },
            upsert: true,
          });
          await this.services.database.update({
            collection: EnvConfig.mongodb.collections.tokens,
            keys: {
              chain: pool.chain,
              address: pool.token1.address,
            },
            updates: {
              ...pool.token1,
            },
            upsert: true,
          });
        }

        await this.services.database.bulkWrite({
          collection: EnvConfig.mongodb.collections.liquidityPools,
          operations: operations,
        });

        if (pools.length > 0) {
          latestPoolId = pools[pools.length - 1].address;

          await this.services.database.update({
            collection: EnvConfig.mongodb.collections.states,
            keys: {
              name: stateKey,
            },
            updates: {
              name: stateKey,
              latestPoolId: latestPoolId,
            },
            upsert: true,
          });
        } else {
          latestPoolId = null;
        }

        const endExeTime = Math.floor(new Date().getTime() / 1000);
        const elapsed = endExeTime - startExeTime;

        logger.info('got subgraph historical data', {
          service: this.name,
          chain: subgraphConfig.chain,
          protocol: subgraphConfig.protocol,
          version: subgraphConfig.version,
          endpoint: subgraphConfig.endpoint,
          elapses: `${elapsed}s`,
        });

        await sleep(2);
      } while (latestPoolId !== null);
    }
  }

  public async runUpdate(options: UpdaterRunUpdateOptions): Promise<void> {
    logger.info('start to run subgraph updater', {
      service: this.name,
      protocol: this.config.protocol,
      subgraphs: this.config.subgraphs ? this.config.subgraphs.length : 'none',
    });

    if (this.config.subgraphs) {
      for (const config of this.config.subgraphs) {
        if (config.version === 'univ2' || config.version === 'univ3') {
          await this.indexSubgraphHistoricalData(config);
        }
      }
    }
  }
}
