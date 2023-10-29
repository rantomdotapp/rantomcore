import { ContractConfig, ProtocolConfig } from '../../types/configs';

const BeethovenxContracts: { [key: string]: ContractConfig } = {
  vault: {
    chain: 'optimism',
    protocol: 'beethovenx',
    address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  },
};

export const BeethovenxConfigs: ProtocolConfig = {
  protocol: 'beethovenx',
  contracts: [BeethovenxContracts.vault],
};
