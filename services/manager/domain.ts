// manage help to manage configs and data
// should be called via API by admin only
import { ContractConfig } from '../../types/configs';
import { IDatabaseService } from '../database/domains';

export interface GetContractConfigOptions {
  chain?: string;
  address?: string;
}

export interface IManagerService {
  // should be labeled as blockchain
  name: string;

  database: IDatabaseService;

  // get all contract configs from the database
  getContractConfigs: (options: GetContractConfigOptions) => Promise<Array<ContractConfig>>;

  // add a new contract config to database
  addContractConfig: (config: ContractConfig) => Promise<void>;
}
