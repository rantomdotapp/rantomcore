import { SubgraphConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import CamelotSubgraphIndexing from './camelot';
import PancakeswapSubgraphIndexing from './pancakeswap';
import SubgraphIndexing from './subgraph';
import SushiSubgraphIndexing from './sushi';
import UniswapSubgraphIndexing from './uniswap';

export function getSubgraph(services: ContextServices, config: SubgraphConfig): SubgraphIndexing | null {
  switch (config.protocol) {
    case 'uniswapv2':
    case 'uniswapv3':
    case 'kyberswap-elastic':
    case 'camelot': {
      return new UniswapSubgraphIndexing(services, config);
    }
    case 'camelotv3': {
      return new CamelotSubgraphIndexing(services, config);
    }
    case 'sushi':
    case 'sushiv3': {
      return new SushiSubgraphIndexing(services, config);
    }
    case 'pancakeswap':
    case 'pancakeswapv3': {
      return new PancakeswapSubgraphIndexing(services, config);
    }

    default: {
      return null;
    }
  }
}
