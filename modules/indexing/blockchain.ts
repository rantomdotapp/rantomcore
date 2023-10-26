import { DefaultQueryLogsBlockRange } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import { compareAddress, normalizeAddress } from '../../lib/helper';
import logger from '../../lib/logger';
import { utilLogMatchFilter } from '../../lib/utils';
import { ContractConfig } from '../../types/configs';
import { ContextServices, IAdapter, IBlockchainIndexing } from '../../types/namespaces';
import { BlockchainIndexingRunOptions } from '../../types/options';
import { getAdapters } from '../adapters';

export default class BlockchainIndexing implements IBlockchainIndexing {
  public readonly name: string = 'indexing.blockchain';
  public readonly services: ContextServices;

  protected readonly contracts: Array<ContractConfig> = [];
  protected readonly adapters: { [key: string]: IAdapter } = {};

  constructor(services: ContextServices) {
    this.services = services;

    this.adapters = getAdapters(services);
  }

  public async run(options: BlockchainIndexingRunOptions): Promise<void> {
    const { chain, fromBlock } = options;

    if (!EnvConfig.blockchains[chain]) {
      return;
    }

    // get list of contract configs
    const contractConfigs: Array<ContractConfig> = await this.services.manager.getContractConfigs({
      chain,
    });

    let startBlock = fromBlock;
    const state = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.states,
      query: {
        name: `indexing-blockchain-${chain}`,
      },
    });
    if (state) {
      startBlock = state.blockNumber;
    }

    const web3 = await this.services.blockchain.getProvider(chain);
    const latestBlock = Number(await web3.eth.getBlockNumber());

    logger.info('start index blockchain data', {
      service: this.name,
      chain: chain,
      fromBlock: startBlock,
      toBlock: latestBlock,
      contracts: contractConfigs.length,
    });

    while (startBlock <= latestBlock) {
      const startExeTime = Math.floor(new Date().getTime() / 1000);

      const toBlock =
        startBlock + DefaultQueryLogsBlockRange > latestBlock ? latestBlock : startBlock + DefaultQueryLogsBlockRange;
      const logs: Array<any> = await web3.eth.getPastLogs({
        fromBlock: startBlock,
        toBlock,
      });

      const rawLogOperations: Array<any> = [];
      for (const log of logs) {
        // first of all, we process logs by adapter hooks
        for (const [, adapter] of Object.entries(this.adapters)) {
          await adapter.handleHookEventLog({
            chain: chain,
            log,
          });
        }

        for (const contract of contractConfigs) {
          if (contract.chain === chain && compareAddress(contract.address, log.address)) {
            if (contract.logFilters) {
              for (const filter of contract.logFilters) {
                if (utilLogMatchFilter(log, filter)) {
                  rawLogOperations.push({
                    updateOne: {
                      filter: {
                        chain: chain,
                        address: normalizeAddress(log.address),
                        transactionHash: log.transactionHash,
                        logIndex: Number(log.logIndex),
                      },
                      update: {
                        $set: {
                          chain: chain,
                          protocol: contract.protocol,
                          blockNumber: Number(log.blockNumber),
                          address: normalizeAddress(log.address),
                          transactionHash: log.transactionHash,
                          logIndex: Number(log.logIndex),
                          topics: log.topics,
                          data: log.data,
                        },
                      },
                      upsert: true,
                    },
                  });
                }
              }
            }
          }
        }
      }

      await this.services.database.bulkWrite({
        collection: EnvConfig.mongodb.collections.rawlogs,
        operations: rawLogOperations,
      });

      const endExeTime = Math.floor(new Date().getTime() / 1000);
      const elapsed = endExeTime - startExeTime;

      logger.info('indexed blockchain data', {
        service: this.name,
        chain: chain,
        fromBlock: startBlock,
        toBlock: toBlock,
        logs: logs.length,
        elapses: `${elapsed}s`,
      });

      startBlock += DefaultQueryLogsBlockRange;
    }
  }
}
