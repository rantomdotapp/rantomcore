import { ProtocolConfig } from '../../types/configs';
import { Aavev1Configs, Aavev2Configs, Aavev3Configs } from './aave';
import { BalancerConfigs } from './balancer';
import { BeethovenxConfigs } from './beethovenx';
import { CamelotConfigs, Camelotv3Configs } from './camelot';
import { CompoundConfigs, Compoundv3Configs } from './compound';
import { IronbankConfigs } from './ironbank';
import { KyberswapElasticConfigs } from './kyberswap';
import { MaverickConfigs } from './maverick';
import { PancakeswapConfigs, Pancakeswapv3Configs } from './pancakeswap';
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
};
