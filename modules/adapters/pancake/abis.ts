import { EventMapping } from '../../../types/configs';

export const PancakeEventSignatures = {
  // v3
  SwapV3: '0x19b47279256b2a23a1665c810c8d55a1758940ee09377d4f8d26497a3577dc83',
};

export const PancakeAbiMappings: { [key: string]: EventMapping } = {
  // v3 Swap
  [PancakeEventSignatures.SwapV3]: {
    abi: [
      {
        indexed: true,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount0',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'amount1',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint160',
        name: 'sqrtPriceX96',
        type: 'uint160',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'liquidity',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'int24',
        name: 'tick',
        type: 'int24',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'protocolFeesToken0',
        type: 'uint128',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'protocolFeesToken1',
        type: 'uint128',
      },
    ],
  },
};
