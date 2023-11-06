import { SubgraphConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import BaseSubgraphIndexing from './base';
import CamelotSubgraphIndexing from './camelot';
import PancakeswapSubgraphIndexing from './pancakeswap';
import SushiSubgraphIndexing from './sushi';
import UniswapSubgraphIndexing from './uniswap';

export function getSubgraphIndexing(services: ContextServices, config: SubgraphConfig): BaseSubgraphIndexing | null {
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
    case 'traderjoe':
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
