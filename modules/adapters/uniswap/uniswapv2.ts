import { UniswapProtocolConfig } from '../../../configs/protocols/uniswap';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions } from '../../../types/options';
import UniswapAdapter from './uniswap';

export default class Uniswapv2Adapter extends UniswapAdapter {
  public readonly name: string = 'adapter.uniswapv2';
  public readonly config: UniswapProtocolConfig;

  constructor(services: ContextServices, config: UniswapProtocolConfig) {
    super(services, config);

    this.config = config;
  }

  /**
   * @description save a new liquidity pool info into database on created event on factory contract
   * this function is compatible with Uniswap v2 factory contract only!
   *
   * @param options includes a chain name and raw log entry
   */
  public async handleHookEventLog(options: HandleHookEventLogOptions): Promise<void> {
    await this.handleHookEventLogCreateLiquidityPool(options, 'univ2');
  }
}
