export type ChainFamily = 'evm';

// Native token on chain
// Can assign any address later
export interface NativeToken {
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// Token defines a ERC20 standard token on EVM chains
export interface Token extends NativeToken {
  chain: string;
  address: string;
}

export interface Blockchain {
  // ex: ethereum
  name: string;

  // default: evm, more coming soon
  family: ChainFamily;

  // default node RPC endpoint
  nodeRpc: string;

  // the native token on chain
  nativeToken: NativeToken;

  // some time we need to get multiple block timestamp
  // subgraph helps us query them in a single API call
  blockSubgraph?: string;
}

export interface EnvConfig {
  mongodb: {
    databaseName: string;
    connectionUri: string;
    collections: {
      // states collection is used to save any states of any services
      // for example, when we sync logs from a contract,
      // we need to save the latest block where logs were sync
      states: string;

      // caching collection used to save any cache data at database level
      // make sure these data can be safety deleted without any issues on services
      caching: string;

      // we save all blockchain contract raw logs into this collection
      rawlogs: string;

      // we save all known tokens into this collections
      tokens: string;

      // save all contract configs
      contracts: string;

      // liquidity pools
      // save all pool on DEXes like: Uniswap, Sushi, Curve ...
      liquidityPools: string;
    };
  };

  system: {
    managerKey: string;
  };

  // some sentry config for monitoring purposes
  sentry: {
    dns: string;
  };

  // we pre-define supported blockchains here
  blockchains: {
    [key: string]: Blockchain;
  };
}

export interface EventMapping {
  abi: Array<any>;
}

export interface ContractLogTopics {
  topic0: string;

  // matching
  topic1?: string;
  topic2?: string;
  topic3?: string;

  // consider a log with these four topics
  // '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
  // '0x0000000000000000000000004cb6f0ef0eeb503f8065af1a6e6d5dd46197d3d9',
  // '0x000000000000000000000000926c777c091a5a070dc24ac94ff498b5a556f92a',
  // '0x000000000000000000000000926c777c091a5a070dc24ac94ff498b5a556f92a',

  // topic0 = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
  // => match

  // topic0 = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
  // topic1 = '0x0000000000000000000000004cb6f0ef0eeb503f8065af1a6e6d5dd46197d3d9'
  // => match

  // topic0 = '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925'
  // topic2 = '0x0000000000000000000000004cb6f0ef0eeb503f8065af1a6e6d5dd46197d3d9'
  // => doesn't match
}

export interface ContractConfig {
  chain: string;

  // the protocol id
  protocol: string;

  // the factory contract address
  address: string;

  // the block number when contract was deployed
  birthblock?: number;

  // used to filter logs
  logFilters?: Array<ContractLogTopics>;
}

export type SubgraphVersion = 'univ2' | 'univ3';

export interface SubgraphConfig {
  chain: string;
  version: SubgraphVersion;
  protocol: string;
  endpoint: string;

  requestOptions?: any;
}

export interface ProtocolConfig {
  protocol: string;
  contracts: Array<ContractConfig>;

  // some protocols are maintaining subgraph indexing
  // because of that, we can use subgraph to indexing historical data
  // on some protocols instead of reindexing historical data onchain
  subgraphs?: Array<SubgraphConfig>;
}
