import { ProtocolConfig } from '../../types/configs';

export const Aavev1Configs: ProtocolConfig = {
  protocol: 'aavev1',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'aavev1',
      address: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
    },
  ],
};

export const Aavev2Configs: ProtocolConfig = {
  protocol: 'aavev2',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'aavev2',
      address: '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9',
    },
    {
      chain: 'polygon',
      protocol: 'aavev2',
      address: '0x8dff5e27ea6b7ac08ebfdf9eb090f32ee9a30fcf',
    },
  ],
};

export const Aavev3Configs: ProtocolConfig = {
  protocol: 'aavev3',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'aavev3',
      address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
    },
    {
      chain: 'arbitrum',
      protocol: 'aavev3',
      address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    },
    {
      chain: 'base',
      protocol: 'aavev3',
      address: '0xa238dd80c259a72e81d7e4664a9801593f98d1c5',
    },
    {
      chain: 'optimism',
      protocol: 'aavev3',
      address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    },
    {
      chain: 'polygon',
      protocol: 'aavev3',
      address: '0x794a61358d6845594f94dc1db02a252b5b4814ad',
    },
  ],
  historicalIndies: [
    {
      chain: 'ethereum',
      protocol: 'aavev3',
      birthblock: 16291127,
      address: '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2',
      topics: [
        '0x2b627736bca15cd5381dcf80b0bf11fd197d01a037c52b927a881a10fb73ba61',
        '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7',
        '0xb3d084820fb1a9decffb176436bd02558d15fac9b0ddfed8c465bc7359d7dce0',
        '0xa534c8dbe71f871f9f3530e97a74601fea17b426cae02e1c5aee42c96c784051',
        '0xefefaba5e921573100900a3ad9cf29f222d995fb3b6045797eaea7521bd8d6f0',
        '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286',
      ],
    },
  ],
};
