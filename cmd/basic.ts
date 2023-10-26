import envConfig from '../configs/envConfig';
import { ContractLogConfigs } from '../configs/logs';
import BlockchainService from '../services/blockchains/blockchain';
import DatabaseService from '../services/database/database';
import { IManagerService } from '../services/manager/domain';
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

  public async preHook(services: ContextServices): Promise<void> {
    await services.database.connect(envConfig.mongodb.connectionUri, envConfig.mongodb.databaseName);

    const manager: IManagerService = new ManagerService(services.database);
    for (const config of ContractLogConfigs) {
      await manager.addContractConfig(config);
    }
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
