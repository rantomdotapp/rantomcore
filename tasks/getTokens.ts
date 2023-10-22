import axios from 'axios';
import * as fs from 'fs';

import { TokenDefaultList } from '../configs/constants/tokenDefaultList';

const chains: any = {
  1: 'ethereum',
  137: 'polygon',
  10: 'optimism',
  8453: 'base',
  42161: 'arbitrum',
};

(async function () {
  const tokenByChains: any = {
    ethereum: {},
    arbitrum: {},
    polygon: {},
    optimism: {},
    base: {},
  };

  for (const list of TokenDefaultList) {
    const response = await axios.get(list);
    const tokens = response.data.tokens ? response.data.tokens : response.data;

    for (const token of tokens) {
      const chain = token.chainId ? chains[token.chainId] : chains[token.network];
      if (chain) {
        tokenByChains[chain][token.symbol] = {
          chain,
          symbol: token.symbol,
          decimals: token.decimals,
          address: token.address.toLowerCase(),
          logoURI: token.img ? token.img : token.logoURI ? token.logoURI : undefined,
        };
      }
    }
  }

  for (const [chain, tokens] of Object.entries(tokenByChains)) {
    fs.writeFileSync(`./configs/tokenlists/${chain}.json`, JSON.stringify(tokens));
  }
})();
