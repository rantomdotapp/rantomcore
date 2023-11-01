import { SubgraphConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import UniswapSubgraphIndexing from './uniswap';

export default class PancakeswapSubgraphIndexing extends UniswapSubgraphIndexing {
  public readonly name: string = 'subgraph.pancakeswap';

  constructor(services: ContextServices, config: SubgraphConfig) {
    super(services, config);
  }

  protected getFieldNames(): any {
    return {
      factories: this.config.version === 'univ2' ? 'pancakeFactories' : 'factories',
      listPools: this.config.version === 'univ2' ? 'pairs' : 'pools',
      poolFee: this.config.version === 'univ2' ? '' : 'feeTier',
      createdAtBlockNumber: this.config.version === 'univ2' ? 'block' : 'createdAtBlockNumber',
    };
  }
}
