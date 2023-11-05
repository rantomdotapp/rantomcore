import { ContractConfig, ProtocolConfig, Token } from '../../types/configs';
import Gmxv2Markets from '../data/Gmxv2Markets.json';

export const GmxConfigs: ProtocolConfig = {
  protocol: 'gmx',
  contracts: [
    {
      chain: 'arbitrum',
      protocol: 'gmx',
      address: '0x489ee077994b6658eafa855c308275ead8097c4a', // Vault
    },
  ],
};

export interface Gmxv2MarketConfig extends ContractConfig {
  indexToken: Token;
  longToken: Token;
  shortToken: Token;
}

export interface Gmxv2Config extends ProtocolConfig {
  markets: Array<Gmxv2MarketConfig>;
}

export const Gmxv2Configs: Gmxv2Config = {
  protocol: 'gmxv2',
  contracts: [
    {
      chain: 'arbitrum',
      protocol: 'gmxv2',
      address: '0xc8ee91a54287db53897056e12d9819156d3822fb', // Event Emiiter
    },
  ],
  markets: Gmxv2Markets,
};
