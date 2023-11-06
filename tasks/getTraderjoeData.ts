// get all pool of traderjoev2
import axios from 'axios';

import envConfig from '../configs/envConfig';
import EnvConfig from '../configs/envConfig';
import { normalizeAddress } from '../lib/helper';
import logger from '../lib/logger';
import DatabaseService from '../services/database/database';
import { LiquidityPoolConstant } from '../types/domains';

const ApiEndpoints = [
  'arbitrum:::0x8e42f2f4101563bf679975178e880fd87d3efd4e:::https://barn.traderjoexyz.com/v1/pools/arbitrum?pageNum=1&pageSize=100&status=all',
  'ethereum:::0xdc8d77b69155c7e68a95a4fb0f06a71ff90b943a:::https://barn.traderjoexyz.com/v1/pools/ethereum?pageNum=1&pageSize=100&status=all',
  'bnbchain:::0x8e42f2f4101563bf679975178e880fd87d3efd4e:::https://barn.traderjoexyz.com/v1/pools/binance?pageNum=1&pageSize=100&status=all',
];

(async function () {
  const database = new DatabaseService();
  await database.connect(envConfig.mongodb.connectionUri, envConfig.mongodb.databaseName);

  const protocol = 'traderjoev2';

  for (const config of ApiEndpoints) {
    const [chain, factory, endpoint] = config.split(':::');
    const response = await axios.get(endpoint);
    for (const pool of response.data as Array<any>) {
      const liquidityPool: LiquidityPoolConstant = {
        protocol,
        chain: chain,
        version: 'traderjoev2.1',
        address: normalizeAddress(pool.pairAddress),
        factory: normalizeAddress(factory),
        token0: {
          chain: chain,
          symbol: pool.tokenX.symbol,
          decimals: Number(pool.tokenX.decimals),
          address: normalizeAddress(pool.tokenX.address),
        },
        token1: {
          chain: chain,
          symbol: pool.tokenY.symbol,
          decimals: Number(pool.tokenY.decimals),
          address: normalizeAddress(pool.tokenY.address),
        },
        fee: 0,
        createdBlockNumber: 0,
      };

      await database.update({
        collection: EnvConfig.mongodb.collections.liquidityPools,
        keys: {
          chain: liquidityPool.chain,
          address: liquidityPool.address,
        },
        updates: {
          ...liquidityPool,
        },
        upsert: true,
      });

      logger.info('updated liquidity pool', {
        protocol: protocol,
        chain: liquidityPool.chain,
        address: liquidityPool.address,
        version: liquidityPool.version,
      });
    }
  }

  process.exit(0);
})();
