import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { StakingPoolConstant } from '../../types/domains';
import { IDatabaseService } from '../database/domains';
import { GetStakingPoolConstantOptions, IDatastoreService } from './domains';

export default class Datastore implements IDatastoreService {
  public readonly name: string = 'datastore';

  private readonly _database: IDatabaseService;

  // chain:stakingPoolAddress:poolId
  private _stakingPools: { [key: string]: StakingPoolConstant } = {};

  constructor(database: IDatabaseService) {
    this._database = database;
  }

  public async loadData(): Promise<void> {
    logger.info('loading constant data from database', {
      service: this.name,
    });

    const pools = await this._database.query({
      collection: EnvConfig.mongodb.collections.stakingPools,
      query: {},
    });
    for (const pool of pools) {
      const key = `${pool.chain}:${pool.address}:${pool.poolId ? pool.poolId : '0'}`;
      this._stakingPools[key] = pool as StakingPoolConstant;
    }

    logger.info('loaded constant data from database', {
      service: this.name,
      stakingPools: Object.keys(this._stakingPools).length,
    });
  }

  public async getStakingPoolConstant(options: GetStakingPoolConstantOptions): Promise<StakingPoolConstant | null> {
    const key = `${options.chain}:${options.address}:${options.poolId ? options.poolId : '0'}`;
    if (this._stakingPools[key]) {
      return this._stakingPools[key];
    }

    return null;
  }

  public async getStakingPoolConstants(options: GetStakingPoolConstantOptions): Promise<Array<StakingPoolConstant>> {
    const pools: Array<StakingPoolConstant> = [];

    let poolId = 0;
    do {
      const key = `${options.chain}:${options.address}:${poolId}`;
      if (this._stakingPools[key]) {
        pools.push(this._stakingPools[key]);
        poolId += 1;
      } else {
        poolId = 0;
      }
    } while (poolId > 0);

    return pools;
  }
}
