import { ContractConfig, ProtocolConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';

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
  factoryBase: {
    chain: 'base',
    protocol: 'sushi',
    address: '0x71524b4f93c58fcbf659783284e38825f0622859',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'sushi',
    address: '0xc35dadb65012ec5796536bd9864ed8773abc74c4',
  },
};

export const SushiConfigs: ProtocolConfig = {
  protocol: 'sushi',
  contracts: [
    SushiContracts.factory,
    SushiContracts.factoryArbitrum,
    SushiContracts.factoryBase,
    SushiContracts.factoryPolygon,
    SushiContracts.factoryBnbchain,
  ],
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
      endpoint: PublicTheGraphEndpoints.sushiArbitrum,
    },
    {
      chain: 'polygon',
      protocol: 'sushi',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.sushiPolygon,
    },
    {
      chain: 'bnbchain',
      protocol: 'sushi',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.sushiBnbchain,
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
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'sushiv3',
    address: '0x126555dd55a39328f69400d6ae4f782bd4c34abb',
  },
};

export const Sushiv3Configs: ProtocolConfig = {
  protocol: 'sushiv3',
  contracts: [
    Sushiv3Contracts.factory,
    Sushiv3Contracts.factoryArbitrum,
    Sushiv3Contracts.factoryBase,
    Sushiv3Contracts.factoryPolygon,
    Sushiv3Contracts.factoryOptimism,
    Sushiv3Contracts.factoryBnbchain,
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
    {
      chain: 'bnbchain',
      protocol: 'sushiv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.sushiv3Bnbchain,
    },
  ],
};
