import { DefaultQueryLogsBlockRange } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import { compareAddress, normalizeAddress } from '../../lib/helper';
import logger from '../../lib/logger';
import { utilLogMatchFilter } from '../../lib/utils';
import { ContractConfig } from '../../types/configs';
import { TransactionAction } from '../../types/domains';
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
    const stateKey = `indexing-chain-${chain}`;
    const state = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.states,
      query: {
        name: stateKey,
      },
    });
    if (state) {
      if (fromBlock < state.blockNumber) {
        startBlock = state.blockNumber;
      }
    }

    const web3 = await this.services.blockchain.getProvider(chain);
    const latestBlock = Number(await web3.eth.getBlockNumber());

    if (startBlock === 0) {
      // sync from latest 1000 blocks
      startBlock = latestBlock - 1000;
    }

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
      const actionOperations: Array<any> = [];
      for (const log of logs) {
        const signature = log.topics[0];

        // first of all, we process logs by adapter hooks
        for (const [, adapter] of Object.entries(this.adapters)) {
          await adapter.handleEventLog({
            chain: chain,
            log,
          });
        }

        // process raw logs if any
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

        // process actions
        for (const [, adapter] of Object.entries(this.adapters)) {
          if (adapter.supportedSignature(signature)) {
            const transaction = await this.services.blockchain.getTransaction({
              chain: chain,
              hash: log.transactionHash,
            });

            const actions: Array<TransactionAction> = await adapter.parseEventLog({
              chain: chain,
              log: log,
              allLogs: logs.filter((item) => item.transactionHash === log.transactionHash),
              transaction: transaction,
            });

            for (const action of actions) {
              actionOperations.push({
                updateOne: {
                  filter: {
                    chain: chain,
                    transactionHash: action.transactionHash,
                    logIndex: action.logIndex,
                  },
                  update: {
                    $set: {
                      ...action,
                    },
                  },
                  upsert: true,
                },
              });
            }
          }
        }
      }

      await this.services.database.bulkWrite({
        collection: EnvConfig.mongodb.collections.rawlogs,
        operations: rawLogOperations,
      });
      await this.services.database.bulkWrite({
        collection: EnvConfig.mongodb.collections.actions,
        operations: actionOperations,
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

      logger.info('got blockchain data', {
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
