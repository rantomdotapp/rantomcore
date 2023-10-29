import { ContractConfig, ProtocolConfig } from '../../types/configs';

const BalancerContracts: { [key: string]: ContractConfig } = {
  vault: {
    chain: 'ethereum',
    protocol: 'balancer',
    address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  },
  veBAL: {
    chain: 'ethereum',
    protocol: 'balancer',
    address: '0xc128a9954e6c874ea3d62ce62b468ba073093f25',
  },
  vaultArbitrum: {
    chain: 'arbitrum',
    protocol: 'balancer',
    address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  },
  vaultBase: {
    chain: 'base',
    protocol: 'balancer',
    address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  },
  vaultPolygon: {
    chain: 'polygon',
    protocol: 'balancer',
    address: '0xba12222222228d8ba445958a75a0704d566bf2c8',
  },
};

export const BalancerConfigs: ProtocolConfig = {
  protocol: 'balancer',
  contracts: [
    BalancerContracts.vault,
    BalancerContracts.veBAL,
    BalancerContracts.vaultArbitrum,
    BalancerContracts.vaultBase,
    BalancerContracts.vaultPolygon,
  ],
};
