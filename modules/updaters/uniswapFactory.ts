import BigNumber from 'bignumber.js';

import { DefaultQueryLogsBlockRangeSingleContract } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { normalizeAddress } from '../../lib/utils';
import { FactoryConfig, ProtocolConfig } from '../../types/configs';
import { LiquidityPoolConstant } from '../../types/domains';
import { ContextServices } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';
import { UniswapAbiMappings, UniswapEventSignatures } from '../adapters/uniswap/abis';
import Updater from './updater';

// this updater index liquidity pools from factory events
export default class UniswapFactoryUpdater extends Updater {
  public readonly name: string = 'updater.uniswapFactory';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  protected async transformLogs(config: FactoryConfig, logs: Array<any>): Promise<Array<LiquidityPoolConstant>> {
    const liquidityPools: Array<LiquidityPoolConstant> = [];

    const web3 = await this.services.blockchain.getProvider(config.chain);
    for (const log of logs) {
      const event: any = web3.eth.abi.decodeLog(UniswapAbiMappings[log.topics[0]].abi, log.data, log.topics.slice(1));
      const poolAddress = normalizeAddress(event.pair ? event.pair : event.pool);
      const token0 = await this.services.blockchain.getTokenInfo({
        chain: config.chain,
        address: event.token0,
      });
      const token1 = await this.services.blockchain.getTokenInfo({
        chain: config.chain,
        address: event.token1,
      });

      if (token0 && token1) {
        liquidityPools.push({
          chain: config.chain,
          address: poolAddress,
          protocol: this.config.protocol,
          version: config.version,
          factory: normalizeAddress(log.address),
          fee: config.version === 'univ2' ? 0.3 : new BigNumber(event.fee.toString()).dividedBy(1e4).toNumber(),
          token0,
          token1,
          createdBlockNumber: Number(log.blockNumber),
        });
      }
    }

    return liquidityPools;
  }

  protected getTopics(config: FactoryConfig): Array<string> {
    return [config.version === 'univ2' ? UniswapEventSignatures.PairCreated : UniswapEventSignatures.PoolCreated];
  }

  protected async indexFactoryHistoricalData(config: FactoryConfig): Promise<void> {
    // first we gte start block from the factory config birthblock
    let startBlock = config.birthblock ? config.birthblock : 0;

    // we find the latest created liquidity pool from database
    const latestLiquidityPool = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.liquidityPools,
      query: {
        chain: config.chain,
        factory: normalizeAddress(config.address),
      },
      options: {
        limit: 1,
        skip: 0,
        order: { createdBlockNumber: -1 },
      },
    });
    if (latestLiquidityPool) {
      // we use the latest created liquidity pool from database if it is greater than config birthblock
      startBlock =
        latestLiquidityPool.createdBlockNumber > startBlock ? latestLiquidityPool.createdBlockNumber : startBlock;
    }

    // next, we find the latest sync state
    const stateKey = `indexing-factory-${config.protocol}-${config.chain}-${config.address}`;
    const state = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.states,
      query: {
        name: stateKey,
      },
    });
    if (state) {
      // we use the latest sync block number
      startBlock = Number(state.blockNumber) > startBlock ? Number(state.blockNumber) : startBlock;
    }

    logger.info('start index liquidity pools from factory events', {
      service: this.name,
      protocol: config.protocol,
      version: config.version,
      factory: config.address,
      fromBlock: startBlock,
    });

    const web3 = this.services.blockchain.getProvider(config.chain);
    const latestBlockNumber = await web3.eth.getBlockNumber();

    while (startBlock <= latestBlockNumber) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);

      const toBlock =
        startBlock + DefaultQueryLogsBlockRangeSingleContract > latestBlockNumber
          ? latestBlockNumber
          : startBlock + DefaultQueryLogsBlockRangeSingleContract;
      const logs = await web3.eth.getPastLogs({
        address: config.address,
        fromBlock: startBlock,
        toBlock: toBlock,
        topics: this.getTopics(config),
      });

      const liquidityPools = await this.transformLogs(config, logs);
      const operations: Array<any> = [];
      for (const liquidityPool of liquidityPools) {
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

      const endExeTime = Math.floor(new Date().getTime() / 1000);
      const elapsed = endExeTime - startExeTime;

      logger.info('start index factory historical data', {
        service: this.name,
        chain: config.chain,
        protocol: config.protocol,
        factory: config.address,
        pools: operations.length,
        toBlock: toBlock,
        elapses: `${elapsed}s`,
      });

      startBlock += DefaultQueryLogsBlockRangeSingleContract;
    }
  }

  public async runUpdate(options: UpdaterRunUpdateOptions): Promise<void> {
    logger.info('start to run factory events updater', {
      service: this.name,
      protocol: this.config.protocol,
      factories: this.config.factories ? this.config.factories.length : 'none',
    });

    if (this.config.factories) {
      for (const config of this.config.factories) {
        await this.indexFactoryHistoricalData(config);
      }
    }
  }
}
