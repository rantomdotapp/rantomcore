import BigNumber from 'bignumber.js';

import { normalizeAddress } from '../../lib/utils';
import { FactoryConfig, ProtocolConfig } from '../../types/configs';
import { LiquidityPoolConstant } from '../../types/domains';
import { ContextServices } from '../../types/namespaces';
import { MaverickAbiMappings, MaverickEventSignatures } from '../adapters/maverick/abis';
import UniswapFactoryUpdater from './uniswapFactory';

export default class MaverickFactoryUpdater extends UniswapFactoryUpdater {
  public readonly name: string = 'updater.maverickFactory';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }

  protected async transformLogs(config: FactoryConfig, logs: Array<any>): Promise<Array<LiquidityPoolConstant>> {
    const liquidityPools: Array<LiquidityPoolConstant> = [];

    const web3 = await this.services.blockchain.getProvider(config.chain);
    for (const log of logs) {
      const event: any = web3.eth.abi.decodeLog(MaverickAbiMappings[log.topics[0]].abi, log.data, log.topics.slice(1));
      const poolAddress = normalizeAddress(event.poolAddress);
      const token0 = await this.services.blockchain.getTokenInfo({
        chain: config.chain,
        address: event.tokenA,
      });
      const token1 = await this.services.blockchain.getTokenInfo({
        chain: config.chain,
        address: event.tokenB,
      });

      if (token0 && token1) {
        liquidityPools.push({
          chain: config.chain,
          address: poolAddress,
          protocol: this.config.protocol,
          version: config.version,
          factory: normalizeAddress(log.address),
          fee: new BigNumber(event.fee.toString()).dividedBy(1e16).toNumber(),
          token0,
          token1,
          createdBlockNumber: Number(log.blockNumber),
        });
      }
    }

    return liquidityPools;
  }

  protected getTopics(config: FactoryConfig): Array<string> {
    return [MaverickEventSignatures.PoolCreated];
  }
}
