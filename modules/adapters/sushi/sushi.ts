import { ProtocolConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import SushiMasterchefUpdater from '../../updaters/sushiMasterchef';
import SushiSubgraphUpdater from '../../updaters/sushiSubgraph';
import Uniswapv2Adapter from '../uniswap/uniswapv2';

export default class SushiAdapter extends Uniswapv2Adapter {
  public readonly name: string = 'adapter.sushi';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.updaters = [new SushiMasterchefUpdater(services, config), new SushiSubgraphUpdater(services, config)];
  }
}
