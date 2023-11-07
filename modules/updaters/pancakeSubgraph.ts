import logger from '../../lib/logger';
import { ProtocolConfig, SubgraphConfig } from '../../types/configs';
import { ContextServices } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';
import UniswapSubgraphUpdater from './uniswapSungraph';

export default class PancakeSubgraphUpdater extends UniswapSubgraphUpdater {
  public readonly name: string = 'updater.pancakeSubgraph';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  // sushi use difference field names on GraphQL queries
  protected subgraphGetFieldNames(config: SubgraphConfig): any {
    return {
      factories: config.version === 'univ2' ? 'pancakeFactories' : 'factories',
      listPools: config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: config.version === 'univ2' ? '' : 'feeTier',
      createdAtBlockNumber: config.version === 'univ2' ? 'block' : 'createdAtBlockNumber',
    };
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
          if (config.chain === 'bnbchain' && config.version === 'univ2') {
            // this endpoint can not be synced with id_gt filter
            // and, we can only sync the first 300 pair data
          } else {
            await this.indexSubgraphHistoricalData(config);
          }
        }
      }
    }
  }
}
