import { ProtocolConfig } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import CamelotSubgraphUpdater from '../../updaters/camelotSubgraph';
import Uniswapv2Adapter from '../uniswap/uniswapv2';

export default class Camelotv3Adapter extends Uniswapv2Adapter {
  public readonly name: string = 'adapter.camelotv3';

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.updaters = [new CamelotSubgraphUpdater(services, config)];
  }
}
