import SushiMasterchefAbi from '../../configs/abi/sushi/Masterchef.json';
import EnvConfig from '../../configs/envConfig';
import { SushiConfig, SushiMasterchefConfig } from '../../configs/protocols/sushi';
import logger from '../../lib/logger';
import { ProtocolConfig } from '../../types/configs';
import { ContextServices } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';
import SushiLibs from '../adapters/sushi/libs';
import Updater from './updater';

export default class SushiMasterchefUpdater extends Updater {
  public readonly name: string = 'updater.sushiMasterchef';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  protected async indexStakingPools(config: SushiMasterchefConfig): Promise<void> {
    let latestPoolId = 0;
    const stateKey = `indexing-staking-pools-${config.protocol}-${config.chain}-${config.address}`;
    const state = await this.services.database.find({
      collection: EnvConfig.mongodb.collections.states,
      query: {
        name: stateKey,
      },
    });
    if (state) {
      latestPoolId = Number(state.latestPoolId);
    }

    const poolLength = await this.services.blockchain.singlecall({
      chain: config.chain,
      abi: SushiMasterchefAbi,
      target: config.address,
      method: 'poolLength',
      params: [],
    });

    for (let poolId = latestPoolId; poolId < Number(poolLength); poolId++) {
      const poolInfo = await SushiLibs.getMasterchefPoolInfo({
        services: this.services,
        protocol: this.config.protocol,
        chain: config.chain,
        address: config.address,
        version: config.version,
        poolId,
      });
      if (poolInfo) {
        await this.services.database.update({
          collection: EnvConfig.mongodb.collections.stakingPools,
          keys: {
            chain: poolInfo.chain,
            address: poolInfo.address,
            poolId: poolInfo.poolId,
          },
          updates: {
            ...poolInfo,
          },
          upsert: true,
        });

        await this.services.database.update({
          collection: EnvConfig.mongodb.collections.states,
          keys: {
            name: stateKey,
          },
          updates: {
            name: stateKey,
            latestPoolId: poolId,
          },
          upsert: true,
        });

        logger.info('got staking pool info', {
          service: this.name,
          chain: poolInfo.chain,
          protocol: poolInfo.protocol,
          contract: poolInfo.address,
          poolId: poolInfo.poolId,
          token: poolInfo.token.symbol,
        });
      }
    }
  }

  public async runUpdate(options: UpdaterRunUpdateOptions): Promise<void> {
    const config: SushiConfig = this.config as SushiConfig;

    if (config.masterchefs) {
      logger.info('start to run masterchef info updater', {
        service: this.name,
        protocol: this.config.protocol,
        masterchefs: config.masterchefs.length,
      });

      for (const masterchef of config.masterchefs) {
        await this.indexStakingPools(masterchef);
      }
    }
  }
}
