import { ProtocolConfig } from '../../types/configs';
import { ContextServices, IUpdater } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';

export default class Updater implements IUpdater {
  public readonly name: string = 'updater';
  public readonly services: ContextServices;
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    this.services = services;
    this.config = config;
  }

  public async runUpdate(options: UpdaterRunUpdateOptions): Promise<void> {
    return Promise.resolve(undefined);
  }
}
