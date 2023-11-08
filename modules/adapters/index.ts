import { ProtocolConfigs } from '../../configs/protocols';
import { ContextServices, IAdapter } from '../../types/namespaces';
import Aavev1Adapter from './aave/aavev1';
import Aavev2Adapter from './aave/aavev2';
import Aavev3Adapter from './aave/aavev3';
import AbracadabraAdapter from './abracadabra/abracadabra';
import AirswapAdapter from './airswap/airswap';
import AnkrAdapter from './ankr/ankr';
import ApecoinAdapter from './apecoin/apecoin';
import BalancerAdapter from './balancer/balancer';
import BancorAdapter from './bancor/bancor';
import BasinAdapter from './basin/basin';
import Camelotv3Adapter from './camelot/camelotv3';
import CarbonAdapter from './carbon/carbon';
import ChaiAdapter from './chai/chai';
import ClipperAdapter from './clipper/clipper';
import CompoundAdapter from './compound/compound';
import Compoundv3Adapter from './compound/compoundv3';
import ConvexAdapter from './convex/convex';
import CowswapAdapter from './cowswap/cowswap';
import CrvusdAdapter from './curve/crvusd';
import DodoAdapter from './dodo/dodo';
import DodoexAdapter from './dodo/dodoex';
import EnsAdapter from './ens/ens';
import Eth2Adapter from './eth2/eth2';
import ExactlyAdapter from './exactly/exactly';
import FraxethAdapter from './fraxeth/fraxeth';
import FraxlendAdapter from './fraxlend/fraxlend';
import GmxAdapter from './gmx/gmx';
import Gmxv2Adapter from './gmx/gmxv2';
import GravitaAdapter from './gravita/gravita';
import IronbankAdapter from './ironbank/ironbank';
import KyberswapAdapter from './kyberswap/kyberswap';
import LevelfinanceAdapter from './levelfinance/levelfinance';
import LidoAdapter from './lido/lido';
import LiquityAdapter from './liquity/liquity';
import MakerAdapter from './maker/maker';
import MaverickAdapter from './maverick/maverick';
import MorphoAdapter from './morpho/morpho';
import MuxAdapter from './mux/mux';
import OdosAdapter from './odos/odos';
import OpenoceanAdapter from './openocean/openocean';
import PancakeAdapter from './pancake/pancake';
import Pancakev3Adapter from './pancake/pancakev3';
import ParaswapAdapter from './paraswap/paraswap';
import PrismaAdapter from './prisma/prisma';
import ReflexerAdapter from './reflexer/reflexer';
import RocketpoolAdapter from './rocketpool/rocketpool';
import StakewiseAdapter from './stakewise/stakewise';
import SushiAdapter from './sushi/sushi';
import Sushiv3Adapter from './sushi/sushiv3';
import SwellAdapter from './swell/swell';
import Traderjoev2Adapter from './traderjoe/traderjoev2';
import Uniswapv2Adapter from './uniswap/uniswapv2';
import Uniswapv3Adapter from './uniswap/uniswapv3';
import ZeroxAdapter from './zerox/zerox';

export function getAdapters(services: ContextServices): { [key: string]: IAdapter } {
  return {
    aavev1: new Aavev1Adapter(services, ProtocolConfigs.aavev1),
    aavev2: new Aavev2Adapter(services, ProtocolConfigs.aavev2),
    aavev3: new Aavev3Adapter(services, ProtocolConfigs.aavev3),
    uniswapv2: new Uniswapv2Adapter(services, ProtocolConfigs.uniswapv2),
    uniswapv3: new Uniswapv3Adapter(services, ProtocolConfigs.uniswapv3),
    compound: new CompoundAdapter(services, ProtocolConfigs.compound),
    compoundv3: new Compoundv3Adapter(services, ProtocolConfigs.compoundv3),
    sushi: new SushiAdapter(services, ProtocolConfigs.sushi),
    sushiv3: new Sushiv3Adapter(services, ProtocolConfigs.sushiv3),
    pancakeswap: new PancakeAdapter(services, ProtocolConfigs.pancakeswap),
    pancakeswapv3: new Pancakev3Adapter(services, ProtocolConfigs.pancakeswapv3),
    'kyberswap-elastic': new Uniswapv3Adapter(services, ProtocolConfigs['kyberswap-elastic']),
    'kyberswap-aggregator': new KyberswapAdapter(services, ProtocolConfigs['kyberswap-aggregator']),
    camelot: new Uniswapv2Adapter(services, ProtocolConfigs.camelot),
    camelotv3: new Camelotv3Adapter(services, ProtocolConfigs.camelotv3),
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
    maker: new MakerAdapter(services, ProtocolConfigs.maker),
    morpho: new MorphoAdapter(services, ProtocolConfigs.morpho),
    prisma: new PrismaAdapter(services, ProtocolConfigs.prisma),
    radiant: new Aavev2Adapter(services, ProtocolConfigs.radiant),
    seamless: new Aavev3Adapter(services, ProtocolConfigs.seamless),
    sonnefinance: new CompoundAdapter(services, ProtocolConfigs.sonnefinance),
    spark: new Aavev3Adapter(services, ProtocolConfigs.spark),
    sturdy: new Aavev2Adapter(services, ProtocolConfigs.sturdy),
    airswap: new AirswapAdapter(services, ProtocolConfigs.airswap),
    bancor: new BancorAdapter(services, ProtocolConfigs.bancor),
    basin: new BasinAdapter(services, ProtocolConfigs.basin),
    carbon: new CarbonAdapter(services, ProtocolConfigs.carbon),
    cowswap: new CowswapAdapter(services, ProtocolConfigs.cowswap),
    dodo: new DodoAdapter(services, ProtocolConfigs.dodo),
    dodoex: new DodoexAdapter(services, ProtocolConfigs.dodoex),
    fraxswap: new Uniswapv2Adapter(services, ProtocolConfigs.fraxswap),
    paraswap: new ParaswapAdapter(services, ProtocolConfigs.paraswap),
    shibaswap: new Uniswapv2Adapter(services, ProtocolConfigs.shibaswap),
    zerox: new ZeroxAdapter(services, ProtocolConfigs.zerox),
    clipper: new ClipperAdapter(services, ProtocolConfigs.clipper),
    odos: new OdosAdapter(services, ProtocolConfigs.odos),
    gmx: new GmxAdapter(services, ProtocolConfigs.gmx),
    gmxv2: new Gmxv2Adapter(services, ProtocolConfigs.gmxv2),
    levelfinance: new LevelfinanceAdapter(services, ProtocolConfigs.levelfinance),
    traderjoe: new Uniswapv2Adapter(services, ProtocolConfigs.traderjoe),
    traderjoev2: new Traderjoev2Adapter(services, ProtocolConfigs.traderjoev2),
    openocean: new OpenoceanAdapter(services, ProtocolConfigs.openocean),
    mux: new MuxAdapter(services, ProtocolConfigs.mux),
    apecoin: new ApecoinAdapter(services, ProtocolConfigs.apecoin),
    ankr: new AnkrAdapter(services, ProtocolConfigs.ankr),
    eth2: new Eth2Adapter(services, ProtocolConfigs.eth2),
    convex: new ConvexAdapter(services, ProtocolConfigs.convex),
    aurafinance: new ConvexAdapter(services, ProtocolConfigs.aurafinance),
    chai: new ChaiAdapter(services, ProtocolConfigs.chai),
    lido: new LidoAdapter(services, ProtocolConfigs.lido),
    fraxeth: new FraxethAdapter(services, ProtocolConfigs.fraxeth),
    rocketpool: new RocketpoolAdapter(services, ProtocolConfigs.rocketpool),
    stakewise: new StakewiseAdapter(services, ProtocolConfigs.stakewise),
    swell: new SwellAdapter(services, ProtocolConfigs.swell),
    ens: new EnsAdapter(services, ProtocolConfigs.ens),
    reflexer: new ReflexerAdapter(services, ProtocolConfigs.reflexer),
  };
}
