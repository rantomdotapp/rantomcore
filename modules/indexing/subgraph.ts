import { ProtocolConfigs } from '../../configs/protocols';
import { ProtocolConfig } from '../../types/configs';
import { ContextServices, ISubgraphIndexing } from '../../types/namespaces';
import { SubgraphIndexingRunOptions } from '../../types/options';
import { getSubgraph } from './subgraphs';

export default class SubgraphIndexing implements ISubgraphIndexing {
  public readonly name: string = 'subgraph';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public async run(options: SubgraphIndexingRunOptions): Promise<void> {
    const { protocol } = options;

    const configs: Array<ProtocolConfig> = [];
    if (protocol) {
      if (ProtocolConfigs[protocol]) {
        configs.push(ProtocolConfigs[protocol]);
      }
    } else {
      for (const [, protocolConfig] of Object.entries(ProtocolConfigs)) {
        configs.push(protocolConfig);
      }
    }

    for (const protocolConfig of configs) {
      if (protocolConfig.subgraphs) {
        for (const config of protocolConfig.subgraphs) {
          const subgraph = getSubgraph(this.services, config);
          if (subgraph) {
            await subgraph.indexHistoricalData();
          }
        }
      }
    }
  }
}
