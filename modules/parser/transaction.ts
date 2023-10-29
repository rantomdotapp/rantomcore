import { DefaultParserCachingTime } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import { getTimestamp } from '../../lib/helper';
import { TransactionAction, TransactionInsight } from '../../types/domains';
import { ContextServices, IAdapter, ITransactionParser, ITransferAdapter } from '../../types/namespaces';
import { ParseTransactionOptions } from '../../types/options';
import { getAdapters } from '../adapters';
import TransferAdapter from '../adapters/transfer/transfer';

export default class TransactionParser implements ITransactionParser {
  public readonly name: string = 'parser';
  public readonly services: ContextServices;

  protected readonly adapters: { [key: string]: IAdapter };
  protected readonly transferAdapter: ITransferAdapter;

  constructor(services: ContextServices) {
    this.services = services;

    // setup adapters
    this.adapters = getAdapters(services);
    this.transferAdapter = new TransferAdapter(services);
  }

  public async parseTransaction(options: ParseTransactionOptions): Promise<Array<TransactionInsight>> {
    const transactions: Array<TransactionInsight> = [];

    if (EnvConfig.policies.enableParserCaching) {
      const document = await this.services.database.find({
        collection: EnvConfig.mongodb.collections.caching,
        query: {
          name: options.hash,
        },
      });

      if (document) {
        const timestamp = getTimestamp();
        const elapsed = timestamp - document.timestamp;
        if (elapsed <= DefaultParserCachingTime) {
          return document.transactions as Array<TransactionInsight>;
        }
      }
    }

    // caching is not enabled, not found or expired
    for (const [chain] of Object.entries(EnvConfig.blockchains)) {
      if (!options.chain || options.chain === chain) {
        const transaction = await this.services.blockchain.getTransaction({
          chain: chain,
          hash: options.hash,
        });
        if (transaction) {
          const receipt = await this.services.blockchain.getTransactionReceipt({
            chain: chain,
            hash: options.hash,
          });
          if (receipt) {
            const transactionInsight: TransactionInsight = {
              chain: chain,
              hash: options.hash,
              timestamp: 0,
              rawdata: transaction,
              receipt: receipt,
              actions: [],
              inputDecoded: null,
              transfers: [],
              addressLabels: {},
            };

            const block = await this.services.blockchain.getBlock(chain, Number(transaction.blockNumber));
            if (block) {
              transactionInsight.timestamp = Number(block.timestamp);
            }

            for (const log of receipt.logs) {
              if (this.transferAdapter.supportedSignature(log.topics[0])) {
                const tokenTransfer = await this.transferAdapter.parseEventLog({
                  chain: chain,
                  log: log,
                  allLogs: receipt.logs,
                  transaction: transaction,
                });
                if (tokenTransfer) {
                  transactionInsight.transfers.push(tokenTransfer);
                }
              }

              for (const [, adapter] of Object.entries(this.adapters)) {
                if (adapter.supportedSignature(log.topics[0])) {
                  const actions: Array<TransactionAction> = await adapter.parseEventLog({
                    chain: chain,
                    log: log,
                    allLogs: receipt.logs,
                    transaction: transaction,
                  });

                  for (const action of actions) {
                    transactionInsight.actions.push(action);
                  }

                  if (actions.length > 0) {
                    // stop going to the next adapter
                    break;
                  }
                }
              }
            }

            transactions.push(transactionInsight);
          }
        }
      }
    }

    if (EnvConfig.policies.enableParserCaching) {
      // save to database
      await this.services.database.update({
        collection: EnvConfig.mongodb.collections.caching,
        keys: {
          name: options.hash,
        },
        updates: {
          name: options.hash,
          timestamp: getTimestamp(),
          transactions: transactions,
        },
        upsert: true,
      });
    }

    return transactions;
  }
}
