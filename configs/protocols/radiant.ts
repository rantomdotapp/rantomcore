import { ProtocolConfig } from '../../types/configs';

export const RadiantConfigs: ProtocolConfig = {
  protocol: 'radiant',
  contracts: [
    {
      chain: 'arbitrum',
      protocol: 'radiant',
      address: '0xf4b1486dd74d07706052a33d31d7c0aafd0659e1',
    },
    {
      chain: 'bnbchain',
      protocol: 'radiant',
      address: '0xd50cf00b6e600dd036ba8ef475677d816d6c4281',
    },
  ],
};
