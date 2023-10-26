import { ProtocolConfig } from '../../types/configs';
import { PancakeswapConfigs, Pancakeswapv3Configs } from './pancakeswap';
import { SushiConfigs, Sushiv3Configs } from './sushi';
import { Uniswapv2Configs, Uniswapv3Configs } from './uniswap';

export const ProtocolConfigs: Array<ProtocolConfig> = [
  Uniswapv2Configs,
  Uniswapv3Configs,
  SushiConfigs,
  Sushiv3Configs,
  PancakeswapConfigs,
  Pancakeswapv3Configs,
];
