import { ProtocolConfig } from '../../types/configs';

export const CelerbridgeConfigs: ProtocolConfig = {
  protocol: 'celerbridge',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'celerbridge',
      address: '0x5427fefa711eff984124bfbb1ab6fbf5e3da1820', // Bridge
    },
    {
      chain: 'arbitrum',
      protocol: 'celerbridge',
      address: '0x1619de6b6b20ed217a58d00f37b9d47c7663feca', // Bridge
    },
    {
      chain: 'optimism',
      protocol: 'celerbridge',
      address: '0x9d39fc627a6d9d9f8c831c16995b209548cc3401', // Bridge
    },
    {
      chain: 'polygon',
      protocol: 'celerbridge',
      address: '0x88dcdc47d2f83a99cf0000fdf667a468bb958a78', // Bridge
    },
    {
      chain: 'bnbchain',
      protocol: 'celerbridge',
      address: '0xdd90e5e87a2081dcf0391920868ebc2ffb81a1af', // Bridge
    },
  ],
};
