import { ProtocolConfig, SubgraphConfig } from '../../types/configs';
import { ContextServices } from '../../types/namespaces';
import UniswapSubgraphUpdater from './uniswapSungraph';

export default class CamelotSubgraphUpdater extends UniswapSubgraphUpdater {
  public readonly name: string = 'updater.camelotSubgraph';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  // sushi use difference field names on GraphQL queries
  protected subgraphGetFieldNames(config: SubgraphConfig): any {
    return {
      factories: config.version === 'univ2' ? 'uniswapFactories' : 'factories',
      listPools: config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: config.version === 'univ2' ? '' : 'feeZtO',
      createdAtBlockNumber: 'createdAtBlockNumber',
    };
  }
}
