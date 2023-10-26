import { ContractConfig, ProtocolConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';

export interface UniswapProtocolConfig extends ProtocolConfig {
  factories: Array<ContractConfig>;
}

const Uniswapv2Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'uniswapv2',
    address: '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f',
    birthBlock: 10000835,
  },
};

export const Uniswapv2Configs: UniswapProtocolConfig = {
  protocol: 'uniswapv2',
  contracts: [Uniswapv2Contracts.factory],
  factories: [Uniswapv2Contracts.factory],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'uniswapv2',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.uniswapv2,
    },
  ],
};

const Uniswapv3Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  },
  factoryBase: {
    chain: 'base',
    protocol: 'uniswapv3',
    address: '0x33128a8fc17869897dce68ed026d694621f6fdfd',
  },
  factoryOptimism: {
    chain: 'optimism',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  },
  factoryPolygon: {
    chain: 'polygon',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'uniswapv3',
    address: '0xdb1d10011ad0ff90774d0c6bb92e5c5c8b4461f7',
  },
};

export const Uniswapv3Configs: UniswapProtocolConfig = {
  protocol: 'uniswapv3',
  contracts: [
    Uniswapv3Contracts.factory,
    Uniswapv3Contracts.factoryArbitrum,
    Uniswapv3Contracts.factoryBase,
    Uniswapv3Contracts.factoryOptimism,
    Uniswapv3Contracts.factoryPolygon,
    Uniswapv3Contracts.factoryBnbchain,
  ],
  factories: [
    Uniswapv3Contracts.factory,
    Uniswapv3Contracts.factoryArbitrum,
    Uniswapv3Contracts.factoryBase,
    Uniswapv3Contracts.factoryOptimism,
    Uniswapv3Contracts.factoryPolygon,
    Uniswapv3Contracts.factoryBnbchain,
  ],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3,
    },
    {
      chain: 'arbitrum',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3Arbitrum,
    },
    {
      chain: 'base',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3Base,
    },
    {
      chain: 'optimism',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3Optimism,
    },
    {
      chain: 'polygon',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3Polygon,
    },
    {
      chain: 'bnbchain',
      protocol: 'uniswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.uniswapv3BnbChain,
    },
  ],
};
