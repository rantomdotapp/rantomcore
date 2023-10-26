import { Uniswapv2Configs, Uniswapv3Configs } from '../../configs/protocols/uniswap';
import { ContextServices, IAdapter } from '../../types/namespaces';
import Uniswapv2Adapter from './uniswap/uniswapv2';
import Uniswapv3Adapter from './uniswap/uniswapv3';

export function getAdapters(services: ContextServices): { [key: string]: IAdapter } {
  return {
    uniswapv2: new Uniswapv2Adapter(services, Uniswapv2Configs),
    uniswapv3: new Uniswapv3Adapter(services, Uniswapv3Configs),
  };
}
