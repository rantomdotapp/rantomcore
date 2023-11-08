import { ContractConfig } from '../../types/configs';
import { ConvexConfig } from './convex';

const AuraBooster: ContractConfig = {
  chain: 'ethereum',
  protocol: 'aurafinance',
  address: '0xa57b8d98dae62b26ec3bcc4a365338157060b234',
};

const AuraBoosterArbitrum: ContractConfig = {
  chain: 'arbitrum',
  protocol: 'aurafinance',
  address: '0x98ef32edd24e2c92525e59afc4475c1242a30184',
};

const AuraBoosterPolygon: ContractConfig = {
  chain: 'polygon',
  protocol: 'aurafinance',
  address: '0x98ef32edd24e2c92525e59afc4475c1242a30184',
};

const AuraBoosterBase: ContractConfig = {
  chain: 'base',
  protocol: 'aurafinance',
  address: '0x98ef32edd24e2c92525e59afc4475c1242a30184',
};

const AuraBoosterOptimism: ContractConfig = {
  chain: 'optimism',
  protocol: 'aurafinance',
  address: '0x98ef32edd24e2c92525e59afc4475c1242a30184',
};

export const AurafinanceConfigs: ConvexConfig = {
  protocol: 'aurafinance',
  contracts: [
    AuraBooster,
    AuraBoosterArbitrum,
    AuraBoosterPolygon,
    AuraBoosterBase,
    AuraBoosterOptimism,
    {
      chain: 'ethereum',
      protocol: 'aurafinance',
      address: '0x00a7ba8ae7bca0b10a32ea1f8e2a1da980c6cad2', // auraBAL staking
    },
    {
      chain: 'ethereum',
      protocol: 'aurafinance',
      address: '0x5e5ea2048475854a5702f5b8468a51ba1296efcc', // auraBAL staking 2
    },
    {
      chain: 'ethereum',
      protocol: 'aurafinance',
      address: '0x3fa73f1e5d8a792c80f426fc8f84fbf7ce9bbcac', // AURA locker
    },
  ],
  masterchefs: [
    {
      version: 'convexBooster',
      ...AuraBooster,
    },
    {
      version: 'convexBooster',
      ...AuraBoosterArbitrum,
    },
    {
      version: 'convexBooster',
      ...AuraBoosterPolygon,
    },
    {
      version: 'convexBooster',
      ...AuraBoosterBase,
    },
    {
      version: 'convexBooster',
      ...AuraBoosterOptimism,
    },
  ],
  stakingTokens: {
    ethereum: {
      '0x00a7ba8ae7bca0b10a32ea1f8e2a1da980c6cad2': {
        stakingToken: {
          chain: 'ethereum',
          symbol: 'auraBAL',
          decimals: 18,
          address: '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d',
        },
        rewardToken: {
          chain: 'ethereum',
          symbol: 'BAL',
          decimals: 18,
          address: '0xba100000625a3754423978a60c9317c58a424e3d',
        },
      },
      '0x5e5ea2048475854a5702f5b8468a51ba1296efcc': {
        stakingToken: {
          chain: 'ethereum',
          symbol: 'auraBAL',
          decimals: 18,
          address: '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d',
        },
        rewardToken: {
          chain: 'ethereum',
          symbol: 'BAL',
          decimals: 18,
          address: '0xba100000625a3754423978a60c9317c58a424e3d',
        },
      },
    },
  },
  lockingTokens: {
    ethereum: {
      chain: 'ethereum',
      symbol: 'AURA',
      decimals: 18,
      address: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf',
    },
  },
};
