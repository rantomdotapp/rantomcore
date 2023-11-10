import { ContractConfig, Token } from '../../types/configs';
import { StakingPoolConstant } from '../../types/domains';
import { SushiConfig } from './sushi';

const ConvexBooster: ContractConfig = {
  chain: 'ethereum',
  protocol: 'convex',
  address: '0xf403c135812408bfbe8713b5a23a04b3d48aae31',
};

const ConvexBoosterArbitrum: ContractConfig = {
  chain: 'arbitrum',
  protocol: 'convex',
  address: '0xf403c135812408bfbe8713b5a23a04b3d48aae31',
};

const ConvexBoosterPolygon: ContractConfig = {
  chain: 'polygon',
  protocol: 'convex',
  address: '0xf403c135812408bfbe8713b5a23a04b3d48aae31',
};

export interface ConvexStakingPoolConstant extends StakingPoolConstant {
  rewardContract: string;
}

export interface ConvexConfig extends SushiConfig {
  stakingTokens: {
    // chain
    [key: string]: {
      // staking address
      [key: string]: {
        stakingToken: Token;
        rewardToken: Token;
      };
    };
  };
  lockingTokens: {
    // chain => Token
    [key: string]: Token;
  };
}

export const ConvexConfigs: ConvexConfig = {
  protocol: 'convex',
  contracts: [
    ConvexBooster,
    ConvexBoosterArbitrum,
    ConvexBoosterPolygon,
    {
      chain: 'ethereum',
      protocol: 'convex',
      address: '0xcf50b810e57ac33b91dcf525c6ddd9881b139332', // Stake CVX earn CRV
    },
    {
      chain: 'ethereum',
      protocol: 'convex',
      address: '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e', // Stake cvxCRV earn CRV
    },
    {
      chain: 'ethereum',
      protocol: 'convex',
      address: '0xd18140b4b819b895a3dba5442f959fa44994af50', // CVX locker old
    },
    {
      chain: 'ethereum',
      protocol: 'convex',
      address: '0x72a19342e8f1838460ebfccef09f6585e32db86e', // CVX locker v2
    },
  ],
  masterchefs: [
    {
      version: 'convexBooster',
      ...ConvexBooster,
    },
    {
      version: 'convexBoosterV2',
      ...ConvexBoosterArbitrum,
    },
    {
      version: 'convexBoosterV2',
      ...ConvexBoosterPolygon,
    },
  ],
  stakingTokens: {
    ethereum: {
      '0xcf50b810e57ac33b91dcf525c6ddd9881b139332': {
        stakingToken: {
          chain: 'ethereum',
          symbol: 'CVX',
          decimals: 18,
          address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
        },
        rewardToken: {
          chain: 'ethereum',
          symbol: 'CRV',
          decimals: 18,
          address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
        },
      },
      '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e': {
        stakingToken: {
          chain: 'ethereum',
          symbol: 'CVXCRV',
          decimals: 18,
          address: '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7',
        },
        rewardToken: {
          chain: 'ethereum',
          symbol: 'CRV',
          decimals: 18,
          address: '0xd533a949740bb3306d119cc777fa900ba034cd52',
        },
      },
    },
  },
  lockingTokens: {
    ethereum: {
      chain: 'ethereum',
      symbol: 'CVX',
      decimals: 18,
      address: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    },
  },
};
