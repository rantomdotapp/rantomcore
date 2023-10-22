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

      // we serve some public api endpoints in this service
      // we save all api request, response for analytics
      apilogs: string;

      // we save all blockchain contract raw logs into this collection
      rawlogs: string;

      // we save all known tokens into this collections
      tokens: string;
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
}
