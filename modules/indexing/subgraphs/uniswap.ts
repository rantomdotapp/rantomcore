import BigNumber from 'bignumber.js';

import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress, sleep } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { querySubgraph } from '../../../lib/subsgraph';
import { SubgraphConfig } from '../../../types/configs';
import { LiquidityPoolConstant, LiquidityPoolVersion } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import SubgraphIndexing from './subgraph';

export default class UniswapSubgraphIndexing extends SubgraphIndexing {
  public readonly name: string = 'subgraph.uniswap';

  constructor(services: ContextServices, config: SubgraphConfig) {
    super(services, config);
  }

  protected getFieldNames(): any {
    return {
      factories: this.config.version === 'univ2' ? 'uniswapFactories' : 'factories',
      listPools: this.config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: this.config.version === 'univ2' ? '' : 'feeTier',
    };
  }

  protected async getFactoryAddress(): Promise<string | null> {
    const fieldNames = this.getFieldNames();
    const data = await querySubgraph(
      this.config.endpoint,
      `
			{
        factories: ${fieldNames.factories}(first: 1) {
			    id
			  }
      }
		`,
      this.config.requestOptions ? this.config.requestOptions : {},
    );

    return data ? normalizeAddress(data.factories[0].id) : null;
  }

  protected async queryPoolList(factoryAddress: string, latestPoolId: string | null): Promise<Array<any>> {
    const fieldNames = this.getFieldNames();
    const data = await querySubgraph(
      this.config.endpoint,
      `
  		{
        pools: ${fieldNames.listPools}(first: 10 ${latestPoolId ? `where: {id_gt: "${latestPoolId}"}` : ''}) {
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
        }
      }
  	`,
      this.config.requestOptions ? this.config.requestOptions : {},
    );

    const pools: Array<LiquidityPoolConstant> = [];
    if (data) {
      for (const pool of data.pools) {
        pools.push({
          chain: this.config.chain,
          version: this.config.version as LiquidityPoolVersion,
          protocol: this.config.protocol,
          address: normalizeAddress(pool.id),
          token0: {
            chain: this.config.chain,
            address: normalizeAddress(pool.token0.id),
            symbol: pool.token0.symbol,
            decimals: Number(pool.token0.decimals),
          },
          token1: {
            chain: this.config.chain,
            address: normalizeAddress(pool.token1.id),
            symbol: pool.token1.symbol,
            decimals: Number(pool.token1.decimals),
          },
          factory: factoryAddress,
          fee:
            this.config.version === 'univ2' ? 0.3 : new BigNumber(pool[fieldNames.poolFee]).dividedBy(1e4).toNumber(),
        });
      }
    }

    return pools;
  }

  public async indexHistoricalData(): Promise<void> {
    if (this.config.version !== 'univ2' && this.config.version !== 'univ3') {
      return;
    }

    const factoryAddress = await this.getFactoryAddress();
    if (factoryAddress) {
      let latestPoolId: string | null = null;

      const stateKey = `indexing-subgraph-${this.config.chain}-${this.config.protocol}-${this.config.version}`;
      const state = await this.services.database.find({
        collection: EnvConfig.mongodb.collections.states,
        query: {
          name: stateKey,
        },
      });
      if (state) {
        latestPoolId = state.latestPoolId;
      }

      logger.info('start index subgraph historical data', {
        service: this.name,
        chain: this.config.chain,
        protocol: this.config.protocol,
        version: this.config.version,
        endpoint: this.config.endpoint,
      });

      do {
        const startExeTime = Math.floor(new Date().getTime() / 1000);

        const pools: Array<LiquidityPoolConstant> = await this.queryPoolList(factoryAddress, latestPoolId);
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
          chain: this.config.chain,
          protocol: this.config.protocol,
          version: this.config.version,
          endpoint: this.config.endpoint,
          elapses: `${elapsed}s`,
        });

        await sleep(2);
      } while (latestPoolId !== null);
    }
  }
}
