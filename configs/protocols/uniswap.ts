import { ContractConfig, ProtocolConfig } from '../../types/configs';

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
};

const Uniswapv3Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    birthBlock: 12369621,
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    birthBlock: 165,
  },
  factoryBase: {
    chain: 'base',
    protocol: 'uniswapv3',
    address: '0x33128a8fc17869897dce68ed026d694621f6fdfd',
    birthBlock: 1371680,
  },
  factoryOptimism: {
    chain: 'optimism',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    birthBlock: 102126,
  },
  factoryPolygon: {
    chain: 'polygon',
    protocol: 'uniswapv3',
    address: '0x1f98431c8ad98523631ae4a59f267346ea31f984',
    birthBlock: 22757547,
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
  ],
  factories: [
    Uniswapv3Contracts.factory,
    Uniswapv3Contracts.factoryArbitrum,
    Uniswapv3Contracts.factoryBase,
    Uniswapv3Contracts.factoryOptimism,
    Uniswapv3Contracts.factoryPolygon,
  ],
};
