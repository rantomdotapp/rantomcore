import { Token } from '../../../types/configs';

export type UniswapPoolVersion = 'univ2' | 'univ3';

export interface UniswapLiquidityPoolConstant {
  chain: string;
  protocol: string;
  address: string;
  factory: string;
  token0: Token; // LP address
  token1: Token;
  fee: number; // 0.3 -> // 0.3%
  version: UniswapPoolVersion;
}
