import { SubgraphConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import UniswapSubgraphIndexing from './uniswap';

export default class CamelotSubgraphIndexing extends UniswapSubgraphIndexing {
  public readonly name: string = 'subgraph.camelot';

  constructor(services: ContextServices, config: SubgraphConfig) {
    super(services, config);
  }

  protected getFieldNames(): any {
    return {
      factories: 'factories',
      listPools: this.config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: this.config.version === 'univ2' ? '' : 'feeZtO',
    };
  }
}
