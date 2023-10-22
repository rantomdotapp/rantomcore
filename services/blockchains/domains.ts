import { Web3 } from 'web3';

import { Token } from '../../types/configs';

export interface ContractCall {
  chain: string;
  target: string;
  abi: Array<any>;
  method: string;
  params: Array<any>;

  // sometime, we need query data at a given block
  // this call requires RPC is an archived node
  blockNumber?: string;
}

export interface GetTokenErc20Options {
  chain: string;
  address: string;

  // force to query data onchain
  onchain?: boolean;
}

export interface IBlockchainService {
  // should be labeled as blockchain
  name: string;

  // we use web3js version 4.0 as EVM blockchain sdk
  providers: { [key: string]: Web3 };

  // get ERC20 token info
  getTokenErc20Info: (options: GetTokenErc20Options) => Promise<Token>;

  // query single
  singlecall: (call: ContractCall) => Promise<any>;
}
