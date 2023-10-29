import BigNumber from 'bignumber.js';

import { compareAddress, normalizeAddress } from '../../../lib/helper';
import { formatFromDecimals } from '../../../lib/utils';
import { ProtocolConfig } from '../../../types/configs';
import { KnownAction, LiquidityPoolConstant, TransactionAction } from '../../../types/domains';
import { ContextServices } from '../../../types/namespaces';
import { HandleHookEventLogOptions, ParseEventLogOptions } from '../../../types/options';
import { UniswapAbiMappings, UniswapEventSignatures } from './abis';
import UniswapAdapter from './uniswap';

export default class Uniswapv3Adapter extends UniswapAdapter {
  public readonly name: string = 'adapter.uniswapv3';
  public readonly config: ProtocolConfig;

  constructor(services: ContextServices, config: ProtocolConfig) {
    super(services, config);

    this.config = config;
    this.eventMappings[UniswapEventSignatures.SwapV3] = UniswapAbiMappings[UniswapEventSignatures.SwapV3];
    this.eventMappings[UniswapEventSignatures.MintV3] = UniswapAbiMappings[UniswapEventSignatures.MintV3];
    this.eventMappings[UniswapEventSignatures.BurnV3] = UniswapAbiMappings[UniswapEventSignatures.BurnV3];
    this.eventMappings[UniswapEventSignatures.CollectV3] = UniswapAbiMappings[UniswapEventSignatures.CollectV3];
  }

  /**
   * @description save a new liquidity pool info into database on created event on factory contract
   * this function is compatible with Uniswap v3 factory contract only!
   *
   * @param options includes a chain name and raw log entry
   */
  public async handleEventLog(options: HandleHookEventLogOptions): Promise<void> {
    await this.handleEventLogCreateLiquidityPool(options, 'univ3');
  }

  /**
   * @description turns a raw event log into TransactionActions
   *
   * @param options include raw log entry and transaction context
   */
  public async parseEventLog(options: ParseEventLogOptions): Promise<Array<TransactionAction>> {
    const actions: Array<TransactionAction> = [];

    const signature = options.log.topics[0];
    if (!this.eventMappings[signature]) {
      return actions;
    }

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

      switch (signature) {
        case UniswapEventSignatures.SwapV3: {
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
          break;
        }
        case UniswapEventSignatures.MintV3:
        case UniswapEventSignatures.BurnV3: {
          const amount0 = formatFromDecimals(event.amount0.toString(), liquidityPool.token0.decimals);
          const amount1 = formatFromDecimals(event.amount1.toString(), liquidityPool.token1.decimals);

          let action: KnownAction = 'deposit';
          let addresses: Array<string> = [];
          if (signature === UniswapEventSignatures.MintV3) {
            action = 'deposit';
            addresses = [normalizeAddress(event.sender), normalizeAddress(event.owner)];
          } else {
            action = 'withdraw';
            addresses = [normalizeAddress(event.owner)];
          }

          actions.push({
            chain: options.chain,
            protocol: this.config.protocol,
            action: action,
            transactionHash: options.log.transactionHash,
            logIndex: `${options.log.logIndex}:0`,
            blockNumber: Number(options.log.blockNumber),
            from: normalizeAddress(options.transaction.from),
            to: normalizeAddress(options.transaction.to),
            contract: normalizeAddress(options.log.address),
            addresses: addresses,
            tokens: [liquidityPool.token0, liquidityPool.token1],
            tokenAmounts: [amount0, amount1],
          });
          break;
        }
        case UniswapEventSignatures.CollectV3: {
          // uniswap v3 Collect event was emitted with a Burn event
          // we find the matching Burn event from the same pool contract
          for (const entry of options.allLogs) {
            if (
              entry.topics[0] === UniswapEventSignatures.BurnV3 &&
              compareAddress(options.log.address, entry.address)
            ) {
              const burnEvent: any = web3.eth.abi.decodeLog(
                UniswapAbiMappings[UniswapEventSignatures.BurnV3].abi,
                entry.data,
                entry.topics.slice(1),
              );
              const burnAmount0 = new BigNumber(burnEvent.amount0.toString());
              const burnAmount1 = new BigNumber(burnEvent.amount1.toString());
              const collectedAmount0 = new BigNumber(event.amount0.toString());
              const collectedAmount1 = new BigNumber(event.amount1.toString());

              const amount0 = formatFromDecimals(
                collectedAmount0.minus(burnAmount0).toString(10),
                liquidityPool.token0.decimals,
              );
              const amount1 = formatFromDecimals(
                collectedAmount1.minus(burnAmount1).toString(10),
                liquidityPool.token1.decimals,
              );

              actions.push({
                chain: options.chain,
                protocol: this.config.protocol,
                action: 'collect',
                transactionHash: options.log.transactionHash,
                logIndex: `${options.log.logIndex}:0`,
                blockNumber: Number(options.log.blockNumber),
                from: normalizeAddress(options.transaction.from),
                to: normalizeAddress(options.transaction.to),
                contract: normalizeAddress(options.log.address),
                addresses: [normalizeAddress(event.owner), normalizeAddress(event.recipient)],
                tokens: [liquidityPool.token0, liquidityPool.token1],
                tokenAmounts: [amount0, amount1],
              });
            }
          }
        }
      }
    }

    return actions;
  }
}
