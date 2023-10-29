import BigNumber from 'bignumber.js';

import { normalizeAddress } from '../../../lib/helper';
import { ProtocolConfig } from '../../../types/configs';
import { LiquidityPoolConstant, TransactionAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { ParseEventLogOptions } from '../../../types/options';
import Uniswapv3Adapter from '../uniswap/uniswapv3';
import { PancakeAbiMappings, PancakeEventSignatures } from './abis';

export default class Pancakev3Adapter extends Uniswapv3Adapter {
  public readonly name: string = 'adapter.pancakev3';
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.config = config;
    this.eventMappings[PancakeEventSignatures.SwapV3] = PancakeAbiMappings[PancakeEventSignatures.SwapV3];
  }

  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    const actions: Array<TransactionAction> = await super.parseEventLog(options);
    if (actions.length > 0) {
      return actions;
    }

    const signature = options.log.topics[0];
    const liquidityPool: LiquidityPoolConstant | null = await this.getLiquidityPool(
      options.chain,
      options.log.address,
      'univ3',
    );
    if (liquidityPool && this.supportedContract(options.chain, liquidityPool.factory)) {
      const web3 = this.services.blockchain.getProvider(options.chain);
      const event: any = web3.eth.abi.decodeLog(
        this.eventMappings[signature].abi,
        options.log.data,
        options.log.topics.slice(1),
      );

      if (signature === PancakeEventSignatures.SwapV3) {
        let amountIn = '0';
        let amountOut = '0';
        let tokenIn = liquidityPool.token0;
        let tokenOut = liquidityPool.token1;

        const amount0 = new BigNumber(event.amount0.toString()).dividedBy(
          new BigNumber(10).pow(liquidityPool.token0.decimals),
        );
        const amount1 = new BigNumber(event.amount1.toString()).dividedBy(
          new BigNumber(10).pow(liquidityPool.token1.decimals),
        );

        if (amount0.lt(0)) {
          // swap from token1 -> token0
          tokenIn = liquidityPool.token1;
          tokenOut = liquidityPool.token0;
          amountIn = amount1.abs().toString(10);
          amountOut = amount0.abs().toString(10);
        } else {
          // swap from token0 -> token1
          tokenIn = liquidityPool.token0;
          tokenOut = liquidityPool.token1;
          amountIn = amount0.abs().toString(10);
          amountOut = amount1.abs().toString(10);
        }

        const sender = normalizeAddress(event.sender);
        const recipient = normalizeAddress(event.recipient);

        actions.push({
          chain: options.chain,
          protocol: this.config.protocol,
          action: 'swap',
          transactionHash: options.log.transactionHash,
          logIndex: `${options.log.logIndex}:0`,
          blockNumber: Number(options.log.blockNumber),
          from: normalizeAddress(options.transaction.from),
          to: normalizeAddress(options.transaction.to),
          contract: normalizeAddress(options.log.address),
          addresses: [sender, recipient],
          tokens: [tokenIn, tokenOut],
          tokenAmounts: [amountIn, amountOut],
        });
      }
    }

    return actions;
  }
}
