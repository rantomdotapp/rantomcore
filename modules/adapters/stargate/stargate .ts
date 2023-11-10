import EnvConfig from '../../../configs/envConfig';
import { LayerZeroChainIdMaps } from '../../../configs/protocols/stargate';
import { formatFromDecimals, normalizeAddress } from '../../../lib/utils';
import { ProtocolConfig } from '../../../types/configs';
import { KnownAction, TransactionAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { ParseEventLogOptions } from '../../../types/options';
import StargatePoolUpdater from '../../updaters/stargatePool';
import Adapter from '../adapter';
import { StargateAbiMappings, StargateEventSignatures } from './abis';

export default class StargateAdapter extends Adapter {
  public readonly name: string = 'adapter.stargate';
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, {
      protocol: config.protocol,
      contracts: config.contracts,
    });

    this.config = config;
    this.eventMappings = StargateAbiMappings;

    this.updaters = [new StargatePoolUpdater(services, config)];
  }

  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    const actions: Array<TransactionAction> = [];

    const signature = options.log.topics[0];
    const web3 = this.services.blockchain.getProvider(options.chain);

    if (
      signature === StargateEventSignatures.Mint ||
      signature === StargateEventSignatures.Burn ||
      signature === StargateEventSignatures.Swap
    ) {
      const stakingPool = await this.services.datastore.getStakingPoolConstant({
        chain: options.chain,
        address: normalizeAddress(options.log.address),
      });
      if (stakingPool) {
        const event = web3.eth.abi.decodeLog(
          this.eventMappings[signature].abi,
          options.log.data,
          options.log.topics.slice(1),
        );
        switch (signature) {
          case StargateEventSignatures.Swap: {
            const amount = formatFromDecimals(event.amountSD.toString(), stakingPool.token.decimals);
            const provider = normalizeAddress(event.from);

            const buildAction = this.buildUpAction({
              ...options,
              action: 'bridge',
              addresses: [provider],
              tokens: [stakingPool.token],
              tokenAmounts: [amount],
            });
            buildAction.addition = {
              fromChain: EnvConfig.blockchains[options.chain].chainId.toString(),
              toChain: LayerZeroChainIdMaps[Number(event.chainId)]
                ? LayerZeroChainIdMaps[Number(event.chainId)].toString()
                : `LayerZeroChainId:${event.chainId.toString()}`,
            };

            actions.push(buildAction);

            break;
          }
          case StargateEventSignatures.Mint:
          case StargateEventSignatures.Burn: {
            const amount = formatFromDecimals(event.amountSD.toString(), stakingPool.token.decimals);
            const provider = event.to ? normalizeAddress(event.to) : normalizeAddress(event.from);
            const action: KnownAction = signature === StargateEventSignatures.Mint ? 'deposit' : 'withdraw';

            actions.push(
              this.buildUpAction({
                ...options,
                action: action,
                addresses: [provider],
                tokens: [stakingPool.token],
                tokenAmounts: [amount],
              }),
            );

            break;
          }
        }
      }
    }

    return actions;
  }
}
