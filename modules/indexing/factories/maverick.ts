import BigNumber from 'bignumber.js';

import { normalizeAddress } from '../../../lib/helper';
import { FactoryConfig } from '../../../types/configs';
import { LiquidityPoolConstant } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { MaverickAbiMappings, MaverickEventSignatures } from '../../adapters/maverick/abis';
import UniswapFactoryIndexing from './uniswap';

export default class MaverickFactoryIndexing extends UniswapFactoryIndexing {
  public readonly name: string = 'factory.maverick';

  constructor(services: ContextServices, config: FactoryConfig) {
    super(services, config);
  }

  protected getTopics(): Array<string> {
    return [MaverickEventSignatures.PoolCreated];
  }

  protected async getLiquidityPoolConstant(log: any): Promise<LiquidityPoolConstant | null> {
    if (this.config.version !== 'mav') {
      return null;
    }

    const signature = log.topics[0];
    const web3 = await this.services.blockchain.getProvider(this.config.chain);
    const event: any = web3.eth.abi.decodeLog(MaverickAbiMappings[signature].abi, log.data, log.topics.slice(1));
    const poolAddress = normalizeAddress(event.poolAddress);
    const token0 = await this.services.blockchain.getTokenInfo({
      chain: this.config.chain,
      address: event.tokenA,
    });
    const token1 = await this.services.blockchain.getTokenInfo({
      chain: this.config.chain,
      address: event.tokenB,
    });

    if (token0 && token1) {
      return {
        chain: this.config.chain,
        address: poolAddress,
        protocol: this.config.protocol,
        version: this.config.version,
        factory: normalizeAddress(log.address),
        fee: new BigNumber(event.fee.toString()).dividedBy(1e16).toNumber(),
        token0,
        token1,
        createdBlockNumber: Number(log.blockNumber),
      };
    }

    return null;
  }
}
