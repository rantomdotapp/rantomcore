import { SubgraphConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import PancakeswapSubgraphIndexing from './pancakeswap';
import SubgraphIndexing from './subgraph';
import SushiSubgraphIndexing from './sushi';
import UniswapSubgraphIndexing from './uniswap';

export function getSubgraph(services: ContextServices, config: SubgraphConfig): SubgraphIndexing | null {
  if (config.protocol === 'uniswapv2' || config.protocol === 'uniswapv3') {
    return new UniswapSubgraphIndexing(services, config);
  } else if (config.protocol === 'sushi' || config.protocol === 'sushiv3') {
    return new SushiSubgraphIndexing(services, config);
  } else if (config.protocol === 'pancakeswap' || config.protocol === 'pancakeswapv3') {
    return new PancakeswapSubgraphIndexing(services, config);
  }

  return null;
}
