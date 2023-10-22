import envConfig from '../configs/envConfig';
import DatabaseService from '../services/database/database';
import { ContextServices } from '../types/namespaces';

export class BasicCommand {
  public readonly name: string = 'command';
  public readonly describe: string = 'Basic command';

  constructor() {}

  public async getServices(): Promise<ContextServices> {
    const database = new DatabaseService();

    const services: ContextServices = {
      database: database,
    };

    await services.database.connect(envConfig.mongodb.connectionUri, envConfig.mongodb.databaseName);

    return services;
  }

  public async execute(argv: any) {}
  public setOptions(yargs: any) {}
}
