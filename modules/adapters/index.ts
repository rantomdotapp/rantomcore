import { ProtocolConfigs } from '../../configs/protocols';
import { ContextServices, IAdapter } from '../../types/namespaces';
import Aavev1Adapter from './aave/aavev1';
import Aavev2Adapter from './aave/aavev2';
import Aavev3Adapter from './aave/aavev3';
import AbracadabraAdapter from './abracadabra/abracadabra';
import BalancerAdapter from './balancer/balancer';
import CompoundAdapter from './compound/compound';
import Compoundv3Adapter from './compound/compoundv3';
import CrvusdAdapter from './curve/crvusd';
import ExactlyAdapter from './exactly/exactly';
import FraxlendAdapter from './fraxlend/fraxlend';
import GravitaAdapter from './gravita/gravita';
import IronbankAdapter from './ironbank/ironbank';
import LiquityAdapter from './liquity/liquity';
import MaverickAdapter from './maverick/maverick';
import Pancakev3Adapter from './pancake/pancakev3';
import Uniswapv2Adapter from './uniswap/uniswapv2';
import Uniswapv3Adapter from './uniswap/uniswapv3';

export function getAdapters(services: ContextServices): { [key: string]: IAdapter } {
  return {
    aavev1: new Aavev1Adapter(services, ProtocolConfigs.aavev1),
    aavev2: new Aavev2Adapter(services, ProtocolConfigs.aavev2),
    aavev3: new Aavev3Adapter(services, ProtocolConfigs.aavev3),
    uniswapv2: new Uniswapv2Adapter(services, ProtocolConfigs.uniswapv2),
    uniswapv3: new Uniswapv3Adapter(services, ProtocolConfigs.uniswapv3),
    compound: new CompoundAdapter(services, ProtocolConfigs.compound),
    compoundv3: new Compoundv3Adapter(services, ProtocolConfigs.compoundv3),
    sushi: new Uniswapv2Adapter(services, ProtocolConfigs.sushi),
    sushiv3: new Uniswapv3Adapter(services, ProtocolConfigs.sushiv3),
    pancakeswap: new Uniswapv2Adapter(services, ProtocolConfigs.pancakeswap),
    pancakeswapv3: new Pancakev3Adapter(services, ProtocolConfigs.pancakeswapv3),
    'kyberswap-elastic': new Pancakev3Adapter(services, ProtocolConfigs['kyberswap-elastic']),
    camelot: new Uniswapv2Adapter(services, ProtocolConfigs.camelot),
    camelotv3: new Uniswapv3Adapter(services, ProtocolConfigs.camelotv3),
    balancer: new BalancerAdapter(services, ProtocolConfigs.balancer),
    beethovenx: new BalancerAdapter(services, ProtocolConfigs.beethovenx),
    maverick: new MaverickAdapter(services, ProtocolConfigs.maverick),
    ironbank: new IronbankAdapter(services, ProtocolConfigs.ironbank),
    fluxfinance: new CompoundAdapter(services, ProtocolConfigs.fluxfinance),
    crvusd: new CrvusdAdapter(services, ProtocolConfigs.crvusd),
    abracadabra: new AbracadabraAdapter(services, ProtocolConfigs.abracadabra),
    fraxlend: new FraxlendAdapter(services, ProtocolConfigs.fraxlend),
    exactly: new ExactlyAdapter(services, ProtocolConfigs.exactly),
    liquity: new LiquityAdapter(services, ProtocolConfigs.liquity),
    gravita: new GravitaAdapter(services, ProtocolConfigs.gravita),
  };
}
