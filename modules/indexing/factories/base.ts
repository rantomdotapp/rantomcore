import { FactoryConfig } from '../../../types/configs';
import { ContextServices, IModule } from '../../../types/namespaces';

export default class BaseFactoryIndexing implements IModule {
  public readonly name: string = 'factory.uniswap';
  public readonly services: ContextServices;

  public readonly config: FactoryConfig;

  constructor(services: ContextServices, config: FactoryConfig) {
    this.services = services;
    this.config = config;
  }

  public async indexHistoricalData(): Promise<void> {}
}
