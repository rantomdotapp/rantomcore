import { SubgraphConfig } from '../../../types/configs';
import { ContextServices, IModule } from '../../../types/namespaces';

export default class BaseSubgraphIndexing implements IModule {
  public readonly name: string = 'subgraph.uniswap';
  public readonly services: ContextServices;

  public readonly config: SubgraphConfig;

  constructor(services: ContextServices, config: SubgraphConfig) {
    this.services = services;
    this.config = config;
  }

  public async indexHistoricalData(): Promise<void> {}
}
