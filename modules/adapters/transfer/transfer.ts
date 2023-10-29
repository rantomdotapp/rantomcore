import { normalizeAddress } from '../../../lib/helper';
import { formatFromDecimals } from '../../../lib/utils';
import { Token } from '../../../types/configs';
import { TokenTransfer } from '../../../types/domains';
import { ContextServices, ITransferAdapter } from '../../../types/namespaces';
import { ParseEventLogOptions } from '../../../types/options';
import { TransferAbiMappings, TransferEventSignatures } from './abis';

export default class TransferAdapter implements ITransferAdapter {
  public readonly name: string = 'adapter.transfer';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public supportedSignature(signature: string): boolean {
    return signature === TransferEventSignatures.Transfer;
  }

  public async parseEventLog(options: ParseEventLogOptions): Promise<TokenTransfer | null> {
    const signature = options.log.topics[0];
    const web3 = this.services.blockchain.getProvider(options.chain);

    try {
      const event: any = web3.eth.abi.decodeLog(
        TransferAbiMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );
      const token: Token | null = await this.services.blockchain.getTokenInfo({
        chain: options.chain,
        address: options.log.address,
      });
      if (token) {
        return {
          token: token,
          eip: 'ERC20',
          from: normalizeAddress(event.from),
          to: normalizeAddress(event.to),
          amount: formatFromDecimals(event.value.toString(), token.decimals),
        };
      }
    } catch (e: any) {}

    return null;
  }
}
