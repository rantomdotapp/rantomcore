import { compareAddress } from '../../lib/helper';
import { EventMapping, ProtocolConfig } from '../../types/configs';
import { TransactionAction } from '../../types/domains';
import { ContextServices, IAdapter } from '../../types/namespaces';
import { HandleHookEventLogOptions, ParseEventLogOptions } from '../../types/options';

export default class Adapter implements IAdapter {
  public readonly name: string = 'adapter';
  public readonly services: ContextServices;
  public readonly config: ProtocolConfig;

  protected eventMappings: { [key: string]: EventMapping } = {};

  constructor(services: ContextServices, config: ProtocolConfig) {
    this.services = services;
    this.config = config;
  }

  public supportedContract(chain: string, address: string): boolean {
    for (const contract of this.config.contracts) {
      if (contract.chain === chain && compareAddress(contract.address, address)) {
        return true;
      }
    }

    return false;
  }

  public supportedSignature(signature: string): boolean {
    return !!this.eventMappings[signature];
  }

  // must be implemented in children
  public async handleEventLog(options: HandleHookEventLogOptions): Promise<void> {
    return Promise.resolve(undefined);
  }

  // must be implemented in children
  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    return [];
  }
}
