import { ProtocolConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import PancakeSubgraphUpdater from '../../updaters/pancakeSubgraph';
import UniswapFactoryUpdater from '../../updaters/uniswapFactory';
import Uniswapv2Adapter from '../uniswap/uniswapv2';

export default class PancakeAdapter extends Uniswapv2Adapter {
  public readonly name: string = 'adapter.pancakev3';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.updaters = [new PancakeSubgraphUpdater(services, config), new UniswapFactoryUpdater(services, config)];
  }
}
