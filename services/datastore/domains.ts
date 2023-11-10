// some protocol have some static data
// we already saved them in database
// however, query database every request is very cost
// we load these data into memory when start the program
// to save the database query operations
import { StakingPoolConstant } from '../../types/domains';

export interface GetStakingPoolConstantOptions {
  chain: string;
  address: string;
  poolId?: number;
}

export interface IDatastoreService {
  name: string;

  // load data from database into memory
  loadData: () => Promise<void>;

  // get staking pool constant
  getStakingPoolConstant: (options: GetStakingPoolConstantOptions) => Promise<StakingPoolConstant | null>;

  // get all staking pool with a given contract address
  getStakingPoolConstants: (options: GetStakingPoolConstantOptions) => Promise<Array<StakingPoolConstant>>;
}
