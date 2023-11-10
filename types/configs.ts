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

export interface NonFungibleToken {
  eip: 'ERC721' | 'ERC1155';

  chain: string;
  name: string;
  address: string;
  tokenId: string;

  logoURI?: string; // the collection logo image
  imageURI?: string; // the token id image
}

export interface Blockchain {
  // ex: ethereum
  name: string;

  chainId: number;

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

      // we save all known tokens into this collections
      tokens: string;
      nonFungibleTokens: string;

      // liquidity pools
      // save all pool on DEXes like: Uniswap, Sushi, Curve ...
      liquidityPools: string;

      // save all staking pools info
      stakingPools: string;

      // save transaction actions
      actions: string;
    };
  };

  // some sentry config for monitoring purposes
  sentry: {
    dns: string;
  };

  // we pre-define supported blockchains here
  blockchains: {
    [key: string]: Blockchain;
  };

  policies: {
    enableParserCaching: boolean;
  };
}

export interface EventMapping {
  abi: Array<any>;
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
  topics?: Array<string>;
}

export type SubgraphVersion = 'univ2' | 'univ3';

export interface SubgraphConfig {
  chain: string;
  version: SubgraphVersion;
  protocol: string;
  endpoint: string;

  requestOptions?: any;
}

export type FactoryVersion = 'univ2' | 'univ3' | 'mav';

export interface FactoryConfig extends ContractConfig {
  version: FactoryVersion;
}

export type MasterchefStakingVersion = 'masterchef' | 'masterchefV2' | 'minichef' | 'convexBooster' | 'convexBoosterV2';

export interface ProtocolConfig {
  protocol: string;
  contracts: Array<ContractConfig>;

  // some protocols are maintaining subgraph indexing
  // because of that, we can use subgraph to indexing historical data
  // on some protocols instead of reindexing historical data onchain
  subgraphs?: Array<SubgraphConfig>;

  // some protocol (DEXes) have a factory contract
  // it creates all liquidity pools or lending pairs contract
  factories?: Array<FactoryConfig>;

  // when protocol was onboard
  // we need to sync historical data
  // this is a list of contract we will use to sync historical data
  // check ProtocolIndexing for the indexing logics
  historicalIndies?: Array<ContractConfig>;
}
