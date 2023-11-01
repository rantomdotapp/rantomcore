import { EventMapping } from '../../../types/configs';

export const MaverickEventSignatures = {
  PoolCreated: '0x9b3fb3a17b4e94eb4d1217257372dcc712218fcd4bc1c28482bd8a6804a7c775',
};

export const MaverickAbiMappings: { [key: string]: EventMapping } = {
  [MaverickEventSignatures.PoolCreated]: {
    abi: [
      {
        indexed: false,
        internalType: 'address',
        name: 'poolAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tickSpacing',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int32',
        name: 'activeTick',
        type: 'int32',
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'lookback',
        type: 'int256',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'protocolFeeRatio',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'tokenA',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'contract IERC20',
        name: 'tokenB',
        type: 'address',
      },
    ],
  },
};
