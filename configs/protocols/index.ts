import { ProtocolConfig } from '../../types/configs';
import { PancakeswapConfigs, Pancakeswapv3Configs } from './pancakeswap';
import { SushiConfigs, Sushiv3Configs } from './sushi';
import { Uniswapv2Configs, Uniswapv3Configs } from './uniswap';

export const ProtocolConfigs: { [key: string]: ProtocolConfig } = {
  uniswapv2: Uniswapv2Configs,
  uniswapv3: Uniswapv3Configs,
  sushi: SushiConfigs,
  sushiv3: Sushiv3Configs,
  pancakeswap: PancakeswapConfigs,
  pancakeswapv3: Pancakeswapv3Configs,
};
