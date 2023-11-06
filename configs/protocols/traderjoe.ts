import { ContractConfig, ProtocolConfig, Token } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';

const TraderjoeContracts: { [key: string]: ContractConfig } = {
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'traderjoe',
    address: '0xae4ec9901c3076d0ddbe76a520f9e90a6227acb7',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'traderjoe',
    address: '0x4f8bdc85e3eec5b9de67097c3f59b6db025d9986',
  },
};

export const TraderjoeConfigs: ProtocolConfig = {
  protocol: 'traderjoe',
  contracts: [TraderjoeContracts.factoryArbitrum, TraderjoeContracts.factoryBnbchain],
  subgraphs: [
    {
      chain: 'arbitrum',
      protocol: 'traderjoe',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.traderjoeArbitrum,
    },
    {
      chain: 'bnbchain',
      protocol: 'traderjoe',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.traderjoeBnbchain,
    },
  ],
};

export interface Traderjoev2PoolConfig extends ContractConfig {
  token0: Token;
  token1: Token;
}

const Traderjoev2Contracts: { [key: string]: ContractConfig } = {
  factoryEthereum: {
    chain: 'ethereum',
    protocol: 'traderjoev2',
    address: '0xdc8d77b69155c7e68a95a4fb0f06a71ff90b943a',
  },
  factoryArbitrum: {
    chain: 'arbitrum',
    protocol: 'traderjoev2',
    address: '0x8e42f2f4101563bf679975178e880fd87d3efd4e',
  },
  factoryBnbchain: {
    chain: 'bnbchain',
    protocol: 'traderjoev2',
    address: '0x8e42f2f4101563bf679975178e880fd87d3efd4e',
  },
};

export const Traderjoev2Configs: ProtocolConfig = {
  protocol: 'traderjoev2',
  contracts: [
    Traderjoev2Contracts.factoryEthereum,
    Traderjoev2Contracts.factoryArbitrum,
    Traderjoev2Contracts.factoryBnbchain,
  ],
};
