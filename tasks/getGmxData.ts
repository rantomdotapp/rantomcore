// get all Gmx v2 markets
import fs from 'fs';

import { Gmxv2MarketConfig } from '../configs/protocols/gmx';
import { normalizeAddress } from '../lib/utils';
import { Gmxv2AbiMappings, Gmxv2EventSignatures } from '../modules/adapters/gmx/abis';
import BlockchainService from '../services/blockchains/blockchain';

const Transactions: Array<string> = [
  'arbitrum:0x8421bfe6f90cb4715b184ab13d3f1a0df8b413bae0e076fa2d9591f66c6ebc53',
  'arbitrum:0x93dbfec9c353671eec2fc40a66e31e5054e3859e76fcdc96f47af9eb3d6777e7',
  'arbitrum:0x80ef8c8a10babfaad5c9b2c97d0f4b0f30f61ba6ceb201ea23f5c5737e46bc36',
  'arbitrum:0x19a0f23c4a4f3c932664171336e0207a07a275a929c3a124755276b7f789f382',
  'arbitrum:0x30fa870e8c153b5e94701297d8c87f75cd6c92d1bee5b162a3543638408ca3a1',
  'arbitrum:0x092f90b524f55983d788fb6b525aade72f4777c4896c0428b2393527f4e4db8c',
  'arbitrum:0xb408fed6009da89125214643ffa13497afc459b4d7e10cfa7c632f232bda367f',
  'arbitrum:0x1a7c06be1bcb7d8927104314c4b6a3f4a41c5589b92c79dc8a413e6d6e0cac88',
  'arbitrum:0x465a300657a0d316f92b225d1f61698db87a2d1889252488ee5a66bf33ca538b',
  'arbitrum:0x7758e5ff6bec78bec60328b1a5d2f719b47d9eb1859d8ccc1095176370c4394e',
  'arbitrum:0x0a7726e1e881ac0dc4cae253147117f0268fb639bd61076858dd3da7e72e1a0f',
  'arbitrum:0x462470e7529bfc0ff898b5cb24c7ea9a056c3c422510be562ad6bc0d3d594ac1',
];

(async function () {
  const protocol = 'gmxv2';
  const markets: Array<Gmxv2MarketConfig> = [];

  const blockchain = new BlockchainService(null);
  for (const transaction of Transactions) {
    const [chain, hash] = transaction.split(':');
    const web3 = blockchain.getProvider(chain);
    const receipt = await blockchain.getTransactionReceipt({
      chain,
      hash,
    });

    for (const log of receipt.logs) {
      const signature = log.topics[0];
      if (signature === Gmxv2EventSignatures.Event1) {
        const event = web3.eth.abi.decodeLog(Gmxv2AbiMappings[signature].abi, log.data, log.topics.slice(1));

        const eventData: any = event.eventData;
        if (event.eventName === 'MarketCreated') {
          const indexToken = await blockchain.getTokenInfo({
            chain: chain,
            address: eventData.addressItems[0][1].value,
          });
          const longToken = await blockchain.getTokenInfo({
            chain: chain,
            address: eventData.addressItems[0][2].value,
          });
          const shortToken = await blockchain.getTokenInfo({
            chain: chain,
            address: eventData.addressItems[0][3].value,
          });

          if (indexToken && longToken && shortToken) {
            markets.push({
              chain,
              protocol,
              address: normalizeAddress(eventData.addressItems[0][0].value),
              indexToken,
              longToken,
              shortToken,
            });

            console.log(
              `Found market chain:${chain} address:${eventData.addressItems[0][0].value} ${longToken.symbol}:${shortToken.symbol}`,
            );
          }
        }
      }
    }
  }

  fs.writeFileSync(`./configs/data/Gmxv2Markets.json`, JSON.stringify(markets));
})();
