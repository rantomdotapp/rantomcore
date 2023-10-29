import { ContractConfig, ProtocolConfig } from '../../types/configs';
import { PublicTheGraphEndpoints } from '../constants/thegraphEndpoints';

const Camelotv2Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'arbitrum',
    protocol: 'camelot',
    address: '0x6eccab422d763ac031210895c81787e87b43a652',
  },
};

export const CamelotConfigs: ProtocolConfig = {
  protocol: 'camelot',
  contracts: [Camelotv2Contracts.factory],
  subgraphs: [
    {
      chain: 'arbitrum',
      protocol: 'camelot',
      version: 'univ2',
      endpoint: PublicTheGraphEndpoints.camelot,
    },
  ],
};

const Camelotv3Contracts: { [key: string]: ContractConfig } = {
  factory: {
    chain: 'ethereum',
    protocol: 'camelotv3',
    address: '0x1a3c9b1d2f0529d97f2afc5136cc23e58f1fd35b',
  },
};

export const Camelotv3Configs: ProtocolConfig = {
  protocol: 'camelotv3',
  contracts: [Camelotv3Contracts.factory],
  subgraphs: [
    {
      chain: 'ethereum',
      protocol: 'camelotv3',
      version: 'univ3',
      endpoint: PublicTheGraphEndpoints.camelotv3,
    },
  ],
};
