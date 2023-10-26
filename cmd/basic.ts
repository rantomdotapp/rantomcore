import BlockchainService from '../services/blockchains/blockchain';
import DatabaseService from '../services/database/database';
import ManagerService from '../services/manager/manager';
import { ContextServices } from '../types/namespaces';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getServices(): Promise<ContextServices> {
    const database = new DatabaseService();
    const blockchain = new BlockchainService(database);
    const manager = new ManagerService(database);

    return {
      database: database,
      blockchain: blockchain,
      manager: manager,
    };
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
