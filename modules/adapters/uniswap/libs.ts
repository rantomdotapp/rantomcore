import UniswapPoolV2Abi from '../../../configs/abi/uniswap/UniswapV2Pair.json';
import UniswapPoolV3Abi from '../../../configs/abi/uniswap/UniswapV3Pool.json';
import { normalizeAddress } from '../../../lib/helper';
import BlockchainService from '../../../services/blockchains/blockchain';
import { UniswapLiquidityPoolConstant, UniswapPoolVersion } from './domains';

export interface GetUniswapLiquidityPoolOptions {
  chain: string;
  address: string; // pool address
  version: UniswapPoolVersion;
  protocol: string;
}

export default class UniswapLibs {
  public static async getLiquidityPoolOnchain(
    options: GetUniswapLiquidityPoolOptions,
  ): Promise<UniswapLiquidityPoolConstant | null> {
    const { chain, address, version, protocol } = options;
    const blockchain = new BlockchainService(null);
    try {
      const [token0Address, token1Address, factoryAddress] = await Promise.all([
        blockchain.singlecall({
          chain,
          abi: version === 'univ2' ? UniswapPoolV2Abi : UniswapPoolV3Abi,
          target: address,
          method: 'token0',
          params: [],
        }),
        blockchain.singlecall({
          chain,
          abi: version === 'univ2' ? UniswapPoolV2Abi : UniswapPoolV3Abi,
          target: address,
          method: 'token1',
          params: [],
        }),
        blockchain.singlecall({
          chain,
          abi: version === 'univ2' ? UniswapPoolV2Abi : UniswapPoolV3Abi,
          target: address,
          method: 'factory',
          params: [],
        }),
      ]);
      const token0 = await blockchain.getTokenInfo({
        chain: chain,
        address: token0Address,
      });
      const token1 = await blockchain.getTokenInfo({
        chain: chain,
        address: token1Address,
      });
      if (token0 && token1) {
        return {
          chain: chain,
          version: version,
          address: normalizeAddress(address),
          protocol: protocol,
          factory: normalizeAddress(factoryAddress),
          token0,
          token1,
          fee: 0.3,
        };
      }
    } catch (e: any) {}

    return null;
  }
}
