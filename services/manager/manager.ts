import EnvConfig from '../../configs/envConfig';
import { normalizeAddress } from '../../lib/helper';
import { ContractConfig } from '../../types/configs';
import { IDatabaseService } from '../database/domains';
import { GetContractConfigOptions, IManagerService } from './domain';

export default class ManagerService implements IManagerService {
  public readonly name: string = 'manager';
  public readonly database: IDatabaseService;

  constructor(database: IDatabaseService) {
    this.database = database;
  }

  public async getContractConfigs(options: GetContractConfigOptions): Promise<Array<ContractConfig>> {
    const query: any = {};
    if (options.chain) {
      query.chain = options.chain;
    }
    if (options.address) {
      query.address = options.address;
    }

    return (await this.database.query({
      collection: EnvConfig.mongodb.collections.contracts,
      query: query,
    })) as Array<ContractConfig>;
  }

  public async addContractConfig(config: ContractConfig): Promise<void> {
    await this.database.update({
      collection: EnvConfig.mongodb.collections.contracts,
      keys: {
        chain: config.chain,
        address: normalizeAddress(config.address),
      },
      updates: {
        ...config,
      },
      upsert: true,
    });
  }
}
