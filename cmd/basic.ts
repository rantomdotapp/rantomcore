import BlockchainService from '../services/blockchains/blockchain';
import DatabaseService from '../services/database/database';
import { ContextServices } from '../types/namespaces';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getServices(): Promise<ContextServices> {
    const database = new DatabaseService();
    const blockchain = new BlockchainService(database);

    return {
      database: database,
      blockchain: blockchain,
    };
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
