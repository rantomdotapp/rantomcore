import { ProtocolConfig, SubgraphConfig } from '../../types/configs';
import { ContextServices } from '../../types/namespaces';
import UniswapSubgraphUpdater from './uniswapSungraph';

export default class SushiSubgraphUpdater extends UniswapSubgraphUpdater {
  public readonly name: string = 'updater.sushiSubgraph';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  // sushi use difference field names on GraphQL queries
  protected subgraphGetFieldNames(config: SubgraphConfig): any {
    return {
      factories: 'factories',
      listPools: config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: config.version === 'univ2' ? '' : 'feeTier',
      createdAtBlockNumber: config.version === 'univ2' ? 'block' : 'createdAtBlockNumber',
    };
  }
}
