// get all ib.xyz markets
import fs from 'fs';

import CompoundErc20Abi from '../configs/abi/compound/cErc20.json';
import { CompoundMarket } from '../configs/protocols/compound';
import { normalizeAddress } from '../lib/utils';
import BlockchainService from '../services/blockchains/blockchain';
import updateToken from './helpers/updateToken';

const IronbankMarkets: Array<string> = [
  'ethereum:0x41c84c0e2ee0b740cf0d31f63f3b6f627dc6b393', // WETH
  'ethereum:0x8e595470ed749b85c6f7669de83eae304c2ec68f', // DAI
  'ethereum:0xe7bff2da8a2f619c2586fb83938fa56ce803aa16', // LINK
  'ethereum:0xfa3472f7319477c9bfecdd66e4b948569e7621b9', // YFI
  'ethereum:0x12a9cc33a980daa74e00cc2d1a0e74c57a93d12c', // SNX
  'ethereum:0x8fc8bfd80d6a9f17fb98a373023d72531792b431', // WBTC
  'ethereum:0x48759f220ed983db51fa7a8c0d2aab8f3ce4166a', // USDT
  'ethereum:0x76eb2fe28b36b3ee97f3adae0c69606eedb2a37c', // USDC
  'ethereum:0xa7c4054afd3dbbbf5bfe80f41862b89ea05c9806', // sUSD
  'ethereum:0xa8caea564811af0e92b1e044f3edd18fa9a73e4f', // EURS
  'ethereum:0xca55f9c4e77f7b8524178583b0f7c798de17fd54', // sEUR
  'ethereum:0x7736ffb07104c0c400bb0cc9a7c228452a732992', // DPI
  'ethereum:0xfeeb92386a055e2ef7c2b598c872a4047a7db59f', // UNI
  'ethereum:0x226f3738238932ba0db2319a8117d9555446102f', // SUSHI
  'ethereum:0xb8c5af54bbdcc61453144cf472a9276ae36109f9', // CRV
  'ethereum:0x30190a3b52b5ab1daf70d46d72536f5171f22340', // AAVE
  'ethereum:0x9e8e207083ffd5bdc3d99a1f32d1e6250869c1a9', // MIM
  'ethereum:0xe0b57feed45e7d908f2d0dacd26f113cf26715bf', // CVX

  'optimism:0x17533a1bDe957979E3977EbbFBC31E6deeb25C7d', // WETH
  'optimism:0x1d073cf59Ae0C169cbc58B6fdD518822ae89173a', // USDC
  'optimism:0x874C01c2d1767EFA01Fa54b2Ac16be96fAd5a742', // USDT
  'optimism:0x049E04bEE77cFfB055f733A138a2F204D3750283', // DAI
  'optimism:0xcdb9b4db65C913aB000b40204248C8A53185D14D', // WBTC
  'optimism:0x4645e0952678E9566FB529D9313f5730E4e1C412', // OP
  'optimism:0xE724FfA5D30782499086682C8362CB3673bF69ae', // SNX
  'optimism:0x04F0fd3CD03B17a3E5921c0170ca6dD3952841cA', // sUSD
];

(async function () {
  const blockchain = new BlockchainService(null);

  const protocol = 'ironbank';
  const allMarkets: Array<CompoundMarket> = [];

  for (const config of IronbankMarkets) {
    const [chain, address] = config.split(':');
    const underlying = await blockchain.singlecall({
      chain: chain,
      target: address,
      abi: CompoundErc20Abi,
      method: 'underlying',
      params: [],
    });
    if (underlying) {
      const token = await blockchain.getTokenInfo({
        chain: chain,
        address: underlying.toString(),
      });

      if (token) {
        updateToken(token);
        allMarkets.push({
          protocol: protocol,
          chain,
          address: normalizeAddress(address),
          etherPool: false,
          underlying: token,
        });
        console.info(`Got market info address:${address} token:${token.symbol}`);
      }
    }
  }

  fs.writeFileSync(`./configs/data/IronbankMarkets.json`, JSON.stringify(allMarkets));
})();
