import dotenv from 'dotenv';

import { EnvConfig } from '../types/configs';
import { NativeTokens } from './constants/nativeTokens';

// global env and configurations
dotenv.config();

const MongodbPrefix = 'rantom';

const envConfig: EnvConfig = {
  mongodb: {
    databaseName: String(process.env.RANTOM_MONGODB_NAME),
    connectionUri: String(process.env.RANTOM_MONGODB_URI),
    collections: {
      //
      states: `${MongodbPrefix}.states`,
      caching: `${MongodbPrefix}.caching`,

      rawlogs: `${MongodbPrefix}.core.rawlogs`,
      tokens: `${MongodbPrefix}.core.tokens`,
      contracts: `${MongodbPrefix}.core.contracts`,
      liquidityPools: `${MongodbPrefix}.core.liquidity.pools`,
    },
  },
  sentry: {
    dns: String(process.env.RANTOM_SENTRY_DNS),
  },
  system: {
    managerKey: String(process.env.RANTOM_MANAGER_KEY),
  },
  blockchains: {
    ethereum: {
      name: 'ethereum',
      family: 'evm',
      nativeToken: NativeTokens.ethereum,
      nodeRpc: String(process.env.RANTOM_ETHEREUM_NODE),
    },
    arbitrum: {
      name: 'arbitrum',
      family: 'evm',
      nativeToken: NativeTokens.arbitrum,
      nodeRpc: String(process.env.RANTOM_ARBITRUM_NODE),
    },
    base: {
      name: 'base',
      family: 'evm',
      nativeToken: NativeTokens.base,
      nodeRpc: String(process.env.RANTOM_BASE_NODE),
    },
    optimism: {
      name: 'optimism',
      family: 'evm',
      nativeToken: NativeTokens.optimism,
      nodeRpc: String(process.env.RANTOM_OPTIMISM_NODE),
    },
    polygon: {
      name: 'polygon',
      family: 'evm',
      nativeToken: NativeTokens.polygon,
      nodeRpc: String(process.env.RANTOM_POLYGON_NODE),
    },
  },
};

export default envConfig;
