import { ProtocolConfigs } from '../../configs/protocols';
import { ContextServices, IModule } from '../../types/namespaces';
import { getSubgraph } from './subgraphs';

export default class SubgraphIndexing implements IModule {
  public readonly name: string = 'subgraph';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public async run(): Promise<void> {
    for (const protocol of ProtocolConfigs) {
      if (protocol.subgraphs) {
        for (const config of protocol.subgraphs) {
          const subgraph = getSubgraph(this.services, config);
          if (subgraph) {
            await subgraph.indexHistoricalData();
          }
        }
      }
    }
  }
}
