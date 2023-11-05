import { FactoryConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import BaseFactoryIndexing from './base';
import MaverickFactoryIndexing from './maverick';
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
    case 'fraxswap':
    case 'shibaswap':
    case 'camelot':
    case 'camelotv3': {
      return new UniswapFactoryIndexing(services, config);
    }

    case 'maverick': {
      return new MaverickFactoryIndexing(services, config);
    }

    default: {
      return null;
    }
  }
}
