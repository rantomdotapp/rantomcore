import { ContractConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';
import { UniswapProtocolConfig } from './uniswap';

const PancakeswapContracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'pancakeswap',
    address: '0x1097053fd2ea711dad45caccc45eff7548fcb362',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'pancakeswap',
    address: '0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e',
  },
  factoryBase: {
    chain: 'base',
    protocol: 'pancakeswap',
    address: '0x02a84c1b3bbd7401a5f7fa98a384ebc70bb5749e',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'pancakeswap',
    address: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73',
  },
};

export const PancakeswapConfigs: UniswapProtocolConfig = {
  protocol: 'pancakeswap',
  contracts: [
    PancakeswapContracts.factory,
    PancakeswapContracts.factoryArbitrum,
    PancakeswapContracts.factoryBase,
    PancakeswapContracts.factoryBnbchain,
  ],
  factories: [
    PancakeswapContracts.factory,
    PancakeswapContracts.factoryArbitrum,
    PancakeswapContracts.factoryBase,
    PancakeswapContracts.factoryBnbchain,
  ],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'pancakeswap',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.pancakeswap,
    },
    {
      chain: 'arbitrum',
      protocol: 'pancakeswap',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.pancakeswapArbitrum,
    },
    {
      chain: 'base',
      protocol: 'pancakeswap',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.pancakeswapBase,
    },
    {
      chain: 'bnbchain',
      protocol: 'pancakeswap',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.pancakeswapBnbchain,
      requestOptions: {
        referer: 'https://pancakeswap.finance/',
        origin: 'https://pancakeswap.finance',
      },
    },
  ],
};

const Pancakeswapv3Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'pancakeswapv3',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'pancakeswapv3',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
  },
  factoryBase: {
    chain: 'base',
    protocol: 'pancakeswapv3',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'pancakeswapv3',
    address: '0x0bfbcf9fa4f9c56b0f40a671ad40e0805a091865',
  },
};

export const Pancakeswapv3Configs: UniswapProtocolConfig = {
  protocol: 'pancakeswapv3',
  contracts: [
    Pancakeswapv3Contracts.factory,
    Pancakeswapv3Contracts.factoryArbitrum,
    Pancakeswapv3Contracts.factoryBase,
    Pancakeswapv3Contracts.factoryBnbchain,
  ],
  factories: [
    Pancakeswapv3Contracts.factory,
    Pancakeswapv3Contracts.factoryArbitrum,
    Pancakeswapv3Contracts.factoryBase,
    Pancakeswapv3Contracts.factoryBnbchain,
  ],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'pancakeswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.pancakeswapv3,
    },
    {
      chain: 'arbitrum',
      protocol: 'pancakeswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.pancakeswapv3Arbitrum,
    },
    {
      chain: 'base',
      protocol: 'pancakeswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.pancakeswapv3Base,
    },
    {
      chain: 'bnbchain',
      protocol: 'pancakeswapv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.pancakeswapv3Bnbchain,
    },
  ],
};
