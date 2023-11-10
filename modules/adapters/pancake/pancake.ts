import { ProtocolConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import PancakeSubgraphUpdater from '../../updaters/pancakeSubgraph';
import SushiMasterchefUpdater from '../../updaters/sushiMasterchef';
import UniswapFactoryUpdater from '../../updaters/uniswapFactory';
import Uniswapv2Adapter from '../uniswap/uniswapv2';

export default class PancakeAdapter extends Uniswapv2Adapter {
  public readonly name: string = 'adapter.pancake';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.updaters = [
      new SushiMasterchefUpdater(services, config),
      new PancakeSubgraphUpdater(services, config),
      new UniswapFactoryUpdater(services, config),
    ];
  }
}
