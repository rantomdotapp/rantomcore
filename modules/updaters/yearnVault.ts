import axios from 'axios';

import YearnStableSwapPoolAbi from '../../configs/abi/yearn/YearnStableswapPool.json';
import EnvConfig from '../../configs/envConfig';
import logger from '../../lib/logger';
import { normalizeAddress } from '../../lib/utils';
import { ProtocolConfig } from '../../types/configs';
import { StakingPoolConstant } from '../../types/domains';
import { ContextServices } from '../../types/namespaces';
import { UpdaterRunUpdateOptions } from '../../types/options';
import YearnLibs from '../adapters/yearn/libs';
import Updater from './updater';

const YearnExporterEndpoints = [
  'ethereum:::https://api.yexporter.io/v1/chains/1/vaults/all',
  'arbitrum:::https://api.yexporter.io/v1/chains/42161/vaults/all',
  'optimism:::https://api.yexporter.io/v1/chains/10/vaults/all',
  'base:::https://api.yexporter.io/v1/chains/8453/vaults/all',
];

const YearnyethLiquidityPool = '0x2cced4ffa804adbe1269cdfc22d7904471abde63';

// get vault from Yearn exporter API
export default class YearnVaultUpdater extends Updater {
  public readonly name: string = 'updater.yearnVault';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  public async runUpdate(options: UpdaterRunUpdateOptions): Promise<void> {
    logger.info('start to run api updater', {
      service: this.name,
      protocol: this.config.protocol,
    });

    // get yearn yETH assets from liquidity pool
    const numAsset = await this.services.blockchain.singlecall({
      chain: 'ethereum',
      abi: YearnStableSwapPoolAbi,
      target: YearnyethLiquidityPool,
      method: 'num_assets',
      params: [],
    });
    for (let poolId = 0; poolId < Number(numAsset); poolId++) {
      const asset = await this.services.blockchain.singlecall({
        chain: 'ethereum',
        abi: YearnStableSwapPoolAbi,
        target: YearnyethLiquidityPool,
        method: 'assets',
        params: [poolId],
      });
      const token = await this.services.blockchain.getTokenInfo({
        chain: 'ethereum',
        address: asset,
      });
      if (token) {
        const stakingPool: StakingPoolConstant = {
          chain: 'ethereum',
          protocol: 'yearneth',
          address: normalizeAddress(YearnyethLiquidityPool),
          token: token,
          poolId: poolId,
        };

        await this.services.database.update({
          collection: EnvConfig.mongodb.collections.stakingPools,
          keys: {
            chain: stakingPool.chain,
            address: stakingPool.address,
            poolId: stakingPool.poolId,
          },
          updates: {
            ...stakingPool,
          },
          upsert: true,
        });

        logger.info('updated asset info', {
          service: this.name,
          chain: 'ethereum',
          protocol: 'yearnyeth',
          address: stakingPool.address,
          token: stakingPool.token.symbol,
        });
      }
    }

    for (const config of YearnExporterEndpoints) {
      const [chain, endpoint] = config.split(':::');
      const response = await axios.get(endpoint);

      const vaults: Array<any> = (response.data as Array<any>).filter((item: any) => item.type === 'v2');

      for (const vault of vaults) {
        const existed = await this.services.database.find({
          collection: EnvConfig.mongodb.collections.stakingPools,
          query: {
            chain: chain,
            address: normalizeAddress(vault.address),
          },
        });
        if (existed) {
          continue;
        }

        const vaultInfo = await YearnLibs.getVaultInfo({
          services: this.services,
          chain: chain,
          protocol: this.config.protocol,
          address: vault.address,
        });
        if (vaultInfo) {
          logger.info('updated vault staking info', {
            service: this.name,
            chain: chain,
            protocol: this.config.protocol,
            address: vaultInfo.address,
            token: vaultInfo.token.symbol,
          });

          await this.services.database.update({
            collection: EnvConfig.mongodb.collections.stakingPools,
            keys: {
              chain: vaultInfo.chain,
              address: vaultInfo.address,
            },
            updates: {
              ...vaultInfo,
            },
            upsert: true,
          });
        }
      }
    }
  }
}
