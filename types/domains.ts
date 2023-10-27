import { Token } from './configs';

export type LiquidityPoolVersion = 'univ2' | 'univ3';

export interface LiquidityPoolConstant {
  chain: string;
  version: LiquidityPoolVersion;
  protocol: string;
  address: string; // pool contract address
  factory: string;
  token0: Token;
  token1: Token;
  fee: number; // 0.3 -> // 0.3%
}
