import { ContractConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';
import { UniswapProtocolConfig } from './uniswap';

const SushiContracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'sushi',
    address: '0xc0aee478e3658e2610c5f7a4a2e1777ce9e4f2ac',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'sushi',
    address: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  },
  factoryPolygon: {
    chain: 'polygon',
    protocol: 'sushi',
    address: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  },
};

export const SushiConfigs: UniswapProtocolConfig = {
  protocol: 'sushi',
  contracts: [SushiContracts.factory, SushiContracts.factoryArbitrum, SushiContracts.factoryPolygon],
  factories: [SushiContracts.factory, SushiContracts.factoryArbitrum, SushiContracts.factoryPolygon],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'sushi',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.sushi,
    },
    {
      chain: 'arbitrum',
      protocol: 'sushi',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.sushi,
    },
    {
      chain: 'polygon',
      protocol: 'sushi',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.sushiPolygon,
    },
  ],
};

const Sushiv3Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'sushiv3',
    address: '0xbaceb8ec6b9355dfc0269c18bac9d6e2bdc29c4f',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'sushiv3',
    address: '0x1af415a1eba07a4986a52b6f2e7de7003d82231e',
  },
  factoryBase: {
    chain: 'base',
    protocol: 'sushiv3',
    address: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  },
  factoryPolygon: {
    chain: 'polygon',
    protocol: 'sushiv3',
    address: '0x917933899c6a5f8e37f31e19f92cdbff7e8ff0e2',
  },
  factoryOptimism: {
    chain: 'optimism',
    protocol: 'sushiv3',
    address: '0x9c6522117e2ed1fe5bdb72bb0ed5e3f2bde7dbe0',
  },
};

export const Sushiv3Configs: UniswapProtocolConfig = {
  protocol: 'sushiv3',
  contracts: [
    Sushiv3Contracts.factory,
    Sushiv3Contracts.factoryArbitrum,
    Sushiv3Contracts.factoryBase,
    Sushiv3Contracts.factoryPolygon,
    Sushiv3Contracts.factoryOptimism,
  ],
  factories: [
    Sushiv3Contracts.factory,
    Sushiv3Contracts.factoryArbitrum,
    Sushiv3Contracts.factoryBase,
    Sushiv3Contracts.factoryPolygon,
    Sushiv3Contracts.factoryOptimism,
  ],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3,
    },
    {
      chain: 'arbitrum',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3Arbitrum,
    },
    {
      chain: 'base',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3Base,
    },
    {
      chain: 'optimism',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3Optimism,
    },
    {
      chain: 'polygon',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3Polygon,
    },
  ],
};
