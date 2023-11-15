import { ProtocolConfig, Token } from '../../../types/configs';
import { ContextServices } from '../../../types/namespaces';
import SushiAdapter from '../sushi/sushi';

export default class PancakeAdapter extends SushiAdapter {
  public readonly name: string = 'adapter.pancake';

  protected readonly rewardToken: Token = {
    chain: 'bnbchain',
    symbol: 'CAKE',
    decimals: 18,
    address: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
  };

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);
  }
}
