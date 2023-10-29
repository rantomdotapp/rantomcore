import { KyberswapElasticConfigs } from '../../configs/protocols/kyberswap';
import { PancakeswapConfigs, Pancakeswapv3Configs } from '../../configs/protocols/pancakeswap';
import { SushiConfigs, Sushiv3Configs } from '../../configs/protocols/sushi';
import { Uniswapv2Configs, Uniswapv3Configs } from '../../configs/protocols/uniswap';
import { ContextServices, IAdapter } from '../../types/namespaces';
import Pancakev3Adapter from './pancake/pancakev3';
import Uniswapv2Adapter from './uniswap/uniswapv2';
import Uniswapv3Adapter from './uniswap/uniswapv3';

export function getAdapters(services: ContextServices): { [key: string]: IAdapter } {
  return {
    uniswapv2: new Uniswapv2Adapter(services, Uniswapv2Configs),
    uniswapv3: new Uniswapv3Adapter(services, Uniswapv3Configs),
    sushi: new Uniswapv2Adapter(services, SushiConfigs),
    sushiv3: new Uniswapv3Adapter(services, Sushiv3Configs),
    pancakeswap: new Uniswapv2Adapter(services, PancakeswapConfigs),
    pancakeswapv3: new Pancakev3Adapter(services, Pancakeswapv3Configs),
    'kyberswap-elastic': new Pancakev3Adapter(services, KyberswapElasticConfigs),
  };
}
