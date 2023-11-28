import { ContractConfig, ProtocolConfig } from '../../types/configs';

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
  factoryAvalanche: {
    chain: 'avalanche',
    protocol: 'kyberswap-elastic',
    address: '0xc7a590291e07b9fe9e64b86c58fd8fc764308c4a',
  },
  factoryFantom: {
    chain: 'fantom',
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
    KyberswapElasticContracts.factoryAvalanche,
    KyberswapElasticContracts.factoryFantom,
  ],
};

export const KyberswapAggregatorConfigs: ProtocolConfig = {
  protocol: 'kyberswap-aggregator',
  contracts: [
    {
      chain: 'ethereum',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'arbitrum',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'base',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'optimism',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'bnbchain',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'avalanche',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
    {
      chain: 'fantom',
      protocol: 'kyberswap-aggregator',
      address: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
    },
  ],
};
