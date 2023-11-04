import { ProtocolConfig } from '../../types/configs';
import { Aavev1Configs, Aavev2Configs, Aavev3Configs } from './aave';
import { AbracadabraConfigs } from './abracadabra';
import { AirswapConfigs } from './airswap';
import { BalancerConfigs } from './balancer';
import { BancorConfigs } from './bancor';
import { BeethovenxConfigs } from './beethovenx';
import { CamelotConfigs, Camelotv3Configs } from './camelot';
import { CompoundConfigs, Compoundv3Configs } from './compound';
import { CrvusdConfigs } from './curve';
import { ExactlyConfigs } from './exactly';
import { FluxfinanceConfigs } from './fluxfinance';
import { FraxlendConfigs } from './fraxlend';
import { GravitaConfigs } from './gravita';
import { IronbankConfigs } from './ironbank';
import { KyberswapElasticConfigs } from './kyberswap';
import { LiquityConfigs } from './liquity';
import { MakerConfigs } from './maker';
import { MaverickConfigs } from './maverick';
import { MorphoConfigs } from './morpho';
import { PancakeswapConfigs, Pancakeswapv3Configs } from './pancakeswap';
import { PrismaConfigs } from './prisma';
import { RadiantConfigs } from './radiant';
import { SeamlessConfigs } from './seamless';
import { SiloConfigs } from './silo';
import { SonnefinanceConfigs } from './sonnefinance';
import { SparkConfigs } from './spark';
import { SturdyConfigs } from './sturdy';
import { SushiConfigs, Sushiv3Configs } from './sushi';
import { Uniswapv2Configs, Uniswapv3Configs } from './uniswap';

export const ProtocolConfigs: { [key: string]: ProtocolConfig } = {
  aavev1: Aavev1Configs,
  aavev2: Aavev2Configs,
  aavev3: Aavev3Configs,
  uniswapv2: Uniswapv2Configs,
  uniswapv3: Uniswapv3Configs,
  compound: CompoundConfigs,
  compoundv3: Compoundv3Configs,
  sushi: SushiConfigs,
  sushiv3: Sushiv3Configs,
  pancakeswap: PancakeswapConfigs,
  pancakeswapv3: Pancakeswapv3Configs,
  'kyberswap-elastic': KyberswapElasticConfigs,
  camelot: CamelotConfigs,
  camelotv3: Camelotv3Configs,
  balancer: BalancerConfigs,
  beethovenx: BeethovenxConfigs,
  maverick: MaverickConfigs,
  ironbank: IronbankConfigs,
  fluxfinance: FluxfinanceConfigs,
  crvusd: CrvusdConfigs,
  abracadabra: AbracadabraConfigs,
  fraxlend: FraxlendConfigs,
  exactly: ExactlyConfigs,
  liquity: LiquityConfigs,
  gravita: GravitaConfigs,
  maker: MakerConfigs,
  morpho: MorphoConfigs,
  prisma: PrismaConfigs,
  radiant: RadiantConfigs,
  seamless: SeamlessConfigs,
  sonnefinance: SonnefinanceConfigs,
  spark: SparkConfigs,
  silo: SiloConfigs,
  sturdy: SturdyConfigs,
  airswap: AirswapConfigs,
  bancor: BancorConfigs,
};
