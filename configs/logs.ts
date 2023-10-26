// what is logs configs will be used for?
// when index blockchain raw logs
// we only save whitelisted log signatures (topic0) and addresses in this configs
import { ContractLogConfig } from '../types/configs';

export const ContractLogConfigs: Array<ContractLogConfig> = [
  // aavev2 lending pool
  {
    chain: 'ethereum',
    address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    filters: [
      {
        topic0: '0xde6857219544bb5b7746f48ed30be6386fefc61b2f864cacf559893bf50fd951', // Deposit
      },
      {
        topic0: '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7', // Withdraw
      },
      {
        topic0: '0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b', // Borrow
      },
      {
        topic0: '0x4cdde6e09bb755c9a5589ebaec640bbfedff1362d4b255ebf8339782b9942faa', // Repay
      },
      {
        topic0: '0x631042c832b07452973831137f2d73e395028b44b250dedc5abb0ee766e168ac', // Flashloan
      },
      {
        topic0: '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286', // Liquidate
      },
    ],
  },

  // aave v3 lending pool
  {
    chain: 'ethereum',
    address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
    filters: [
      {
        topic0: '0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61', // Supply
      },
      {
        topic0: '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7', // Withdraw
      },
      {
        topic0: '0xb3d084820fb1a9decffb176436bd02558d15fac9b0ddfed8c465bc7359d7dce0', // Borrow
      },
      {
        topic0: '0xa534c8dbe71f871f9f3530e97a74601fea17b426cae02e1c5aee42c96c784051', // Repay
      },
      {
        topic0: '0xefefaba5e921573100900a3ad9cf29f222d995fb3b6045797eaea7521bd8d6f0', // Flashloan
      },
      {
        topic0: '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286', // Liquidate
      },
    ],
  },
];
