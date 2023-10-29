import { ContractConfig, ProtocolConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';

const KyberswapElasticContracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryBase: {
    chain: 'base',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryOptimism: {
    chain: 'optimism',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryPolygon: {
    chain: 'polygon',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
};

export const KyberswapElasticConfigs: ProtocolConfig = {
  protocol: 'kyberswap-elastic',
  contracts: [
    KyberswapElasticContracts.factory,
    KyberswapElasticContracts.factoryArbitrum,
    KyberswapElasticContracts.factoryBase,
    KyberswapElasticContracts.factoryOptimism,
    KyberswapElasticContracts.factoryPolygon,
    KyberswapElasticContracts.factoryBnbchain,
  ],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElastic,
    },
    {
      chain: 'arbitrum',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElasticArbitrum,
    },
    {
      chain: 'base',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElasticBase,
    },
    {
      chain: 'optimism',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElasticOptimism,
    },
    {
      chain: 'polygon',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElasticPolygon,
    },
    {
      chain: 'bnbchain',
      protocol: 'kyberswap-elastic',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.kyberswapElasticBnbchain,
    },
  ],
};
