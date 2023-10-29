import { Token } from '../types/configs';
import TokenListArbitrum from './tokenlists/arbitrum.json';
import TokenListBase from './tokenlists/base.json';
import TokenListBnbchain from './tokenlists/bnbchain.json';
import TokenListEthereum from './tokenlists/ethereum.json';
import TokenListOptimism from './tokenlists/optimism.json';
import TokenListPolygon from './tokenlists/polygon.json';

export const TokenList: {
  [key: string]: {
    [key: string]: Token;
  };
} = {
  ethereum: TokenListEthereum,
  arbitrum: TokenListArbitrum,
  base: TokenListBase,
  optimism: TokenListOptimism,
  polygon: TokenListPolygon,
  bnbchain: TokenListBnbchain,
};

export const DefaultQueryLogsBlockRange = 100;

// we save latest parsed transactions into database for fast query
// this value is the number of seconds of the caching
export const DefaultParserCachingTime = 5 * 60;
