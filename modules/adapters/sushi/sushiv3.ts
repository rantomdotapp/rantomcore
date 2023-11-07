import { ProtocolConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import SushiSubgraphUpdater from '../../updaters/sushiSubgraph';
import Uniswapv3Adapter from '../uniswap/uniswapv3';

export default class Sushiv3Adapter extends Uniswapv3Adapter {
  public readonly name: string = 'adapter.sushiv3';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.updaters = [new SushiSubgraphUpdater(services, config)];
  }
}
