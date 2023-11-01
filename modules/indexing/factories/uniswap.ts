import BigNumber from 'bignumber.js';

import { DefaultQueryLogsBlockRangeSingleContract } from '../../../configs';
import EnvConfig from '../../../configs/envConfig';
import { normalizeAddress } from '../../../lib/helper';
import logger from '../../../lib/logger';
import { FactoryConfig } from '../../../types/configs';
import { LiquidityPoolConstant } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { UniswapAbiMappings, UniswapEventSignatures } from '../../adapters/uniswap/abis';
import BaseFactoryIndexing from './base';

export default class UniswapFactoryIndexing extends BaseFactoryIndexing {
  public readonly name: string = 'factory.uniswap';

  constructor(services: ContextServices, config: FactoryConfig) {
    super(services, config);
  }

  public async indexHistoricalData(): Promise<void> {
    if (this.config.version !== 'univ2' && this.config.version !== 'univ3') {
      return;
    }

    let startBlock = this.config.birthblock ? this.config.birthblock : 0;
    const stateKey = `indexing-factory-${this.config.chain}-${this.config.address}`;
    const state = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.states,
      query: {
        name: stateKey,
      },
    });
    if (state) {
      startBlock = state.blockNumber > startBlock ? state.blockNumber : startBlock;
    }

    logger.info('start index factory historical data', {
      service: this.name,
      chain: this.config.chain,
      protocol: this.config.protocol,
      factory: this.config.address,
      fromBlock: startBlock,
    });

    const web3 = await this.services.blockchain.getProvider(this.config.chain);
    const latestBlock = await web3.eth.getBlockNumber();

    while (startBlock <= latestBlock) {
      const toBlock =
        startBlock + DefaultQueryLogsBlockRangeSingleContract > latestBlock
          ? latestBlock
          : startBlock + DefaultQueryLogsBlockRangeSingleContract;
      const logs = await web3.eth.getPastLogs({
        address: this.config.address,
        topics: [
          this.config.version === 'univ2' ? UniswapEventSignatures.PairCreated : UniswapEventSignatures.PoolCreated,
        ],
        fromBlock: startBlock,
        toBlock: toBlock,
      });

      const operations: Array<any> = [];
      for (const log of logs) {
        const signature = log.topics[0];
        const event: any = web3.eth.abi.decodeLog(UniswapAbiMappings[signature].abi, log.data, log.topics.slice(1));
        const poolAddress = normalizeAddress(event.pair ? event.pair : event.pool);
        const token0 = await this.services.blockchain.getTokenInfo({
          chain: this.config.chain,
          address: event.token0,
        });
        const token1 = await this.services.blockchain.getTokenInfo({
          chain: this.config.chain,
          address: event.token1,
        });

        if (token0 && token1) {
          const liquidityPool: LiquidityPoolConstant = {
            chain: this.config.chain,
            address: poolAddress,
            protocol: this.config.protocol,
            version: this.config.version,
            factory: normalizeAddress(log.address),
            fee: this.config.version === 'univ2' ? 0.3 : new BigNumber(event.fee.toString()).dividedBy(1e4).toNumber(),
            token0,
            token1,
            createdBlockNumber: Number(log.blockNumber),
          };

          operations.push({
            updateOne: {
              filter: {
                chain: liquidityPool.chain,
                address: liquidityPool.address,
              },
              update: {
                $set: {
                  ...liquidityPool,
                },
              },
              upsert: true,
            },
          });
        }
      }

      await this.services.database.bulkWrite({
        collection: EnvConfig.mongodb.collections.liquidityPools,
        operations: operations,
      });

      await this.services.database.update({
        collection: EnvConfig.mongodb.collections.states,
        keys: {
          name: stateKey,
        },
        updates: {
          name: stateKey,
          blockNumber: toBlock,
        },
        upsert: true,
      });

      logger.info('start index factory historical data', {
        service: this.name,
        chain: this.config.chain,
        protocol: this.config.protocol,
        factory: this.config.address,
        pools: operations.length,
        toBlock: toBlock,
      });

      startBlock += DefaultQueryLogsBlockRangeSingleContract;
    }
  }
}
