import { FactoryConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import BaseFactoryIndexing from './base';
import UniswapFactoryIndexing from './uniswap';

export function getFactoryIndexing(services: ContextServices, config: FactoryConfig): BaseFactoryIndexing | null {
  switch (config.protocol) {
    case 'uniswapv2':
    case 'uniswapv3':
    case 'sushi':
    case 'sushiv3':
    case 'pancakeswap':
    case 'pancakeswapv3':
    case 'kyberswap-elastic':
    case 'camelot':
    case 'camelotv3': {
      return new UniswapFactoryIndexing(services, config);
    }

    default: {
      return null;
    }
  }
}
