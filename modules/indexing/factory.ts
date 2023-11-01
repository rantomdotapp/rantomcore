import { ProtocolConfigs } from '../../configs/protocols';
import { ProtocolConfig } from '../../types/configs';
import { ContextServices, IFactoryIndexing } from '../../types/namespaces';
import { FactoryIndexingRunOptions } from '../../types/options';
import { getFactoryIndexing } from './factories';

export default class FactoryIndexing implements IFactoryIndexing {
  public readonly name: string = 'factory';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public async run(options: FactoryIndexingRunOptions): Promise<void> {
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
      if (protocolConfig.factories) {
        for (const config of protocolConfig.factories) {
          const factory = getFactoryIndexing(this.services, config);
          if (factory) {
            await factory.indexHistoricalData();
          }
        }
      }
    }
  }
}
