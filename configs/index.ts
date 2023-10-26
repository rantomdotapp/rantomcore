import { Token } from '../types/configs';
import TokenListArbitrum from './tokenlists/arbitrum.json';
import TokenListBase from './tokenlists/base.json';
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
};

export const DefaultQueryLogsBlockRange = 100;

export const DefaultBlockNumberIndexingFrom: { [key: string]: number } = {
  ethereum: 18426781,
};
