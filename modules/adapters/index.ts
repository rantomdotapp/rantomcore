import { ProtocolConfigs } from '../../configs/protocols';
import { ContextServices, IAdapter } from '../../types/namespaces';
import BalancerAdapter from './balancer/balancer';
import MaverickAdapter from './maverick/maverick';
import Pancakev3Adapter from './pancake/pancakev3';
import Uniswapv2Adapter from './uniswap/uniswapv2';
import Uniswapv3Adapter from './uniswap/uniswapv3';

export function getAdapters(services: ContextServices): { [key: string]: IAdapter } {
  return {
    uniswapv2: new Uniswapv2Adapter(services, ProtocolConfigs.uniswapv2),
    uniswapv3: new Uniswapv3Adapter(services, ProtocolConfigs.uniswapv3),
    sushi: new Uniswapv2Adapter(services, ProtocolConfigs.sushi),
    sushiv3: new Uniswapv3Adapter(services, ProtocolConfigs.sushiv2),
    pancakeswap: new Uniswapv2Adapter(services, ProtocolConfigs.pancakeswap),
    pancakeswapv3: new Pancakev3Adapter(services, ProtocolConfigs.pancakeswapv3),
    'kyberswap-elastic': new Pancakev3Adapter(services, ProtocolConfigs['kyberswap-elastic']),
    camelot: new Uniswapv2Adapter(services, ProtocolConfigs.camelot),
    camelotv3: new Uniswapv3Adapter(services, ProtocolConfigs.camelotv3),
    balancer: new BalancerAdapter(services, ProtocolConfigs.balancer),
    beethovenx: new BalancerAdapter(services, ProtocolConfigs.beethovenx),
    maverick: new MaverickAdapter(services, ProtocolConfigs.maverick),
  };
}
