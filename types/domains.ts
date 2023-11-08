import { NonFungibleToken, Token } from './configs';

export type LiquidityPoolVersion = 'univ2' | 'univ3' | 'mav' | 'traderjoev2.1';

export interface LiquidityPoolConstant {
  chain: string;
  version: LiquidityPoolVersion;
  protocol: string;
  address: string; // pool contract address
  factory: string;
  token0: Token;
  token1: Token;
  fee: number; // 0.3 -> // 0.3%

  // the block number when this pool was created
  createdBlockNumber: number;
}

// staking pool present a staking info of a staking contract
// which identify by poolId
// for example, these pools on sushi masterchef or convex finance booster, ...
export interface StakingPoolConstant {
  chain: string;
  protocol: string;

  // the masterchef or staking contract
  address: string;

  // pool ID
  poolId: number;

  token: Token;
}

export const Actions = [
  // define atomic token exchange actions
  // for example, the exchange of USDC for ETH is a swap action
  'swap',

  // define token exchange via multiple routes actions
  // for example, the exchange of USDC -> DAI -> USDT -> ETH
  // is a trade action (trade USDC for ETH)
  'trade',

  // define token transfer from users to protocol contracts actions
  // it could be the add liquidity, lend or stake tokens actions,
  'deposit',

  // define token transfer from protocol contracts to users actions
  // it could be the remove liquidity, or unstake tokens actions,
  'withdraw',

  // define token borrow actions on lending protocols
  'borrow',

  // define token repaid actions on lending protocols
  'repay',

  // liquidation action
  'liquidate',

  // collect rewards, fees, ...
  'collect',

  // define lock/unlock token actions
  'lock',
  'unlock',

  // define flashloan actions
  'flashloan',

  // perpetual increase/decrease long position
  'increaseLong',
  'decreaseLong',

  // perpetual increase/decrease short position
  'increaseShort',
  'decreaseShort',

  // perpetual liquidate long/short
  'liquidateLong',
  'liquidateShort',

  // register/renew domain name, services
  'register',
  'renew',
] as const;
export type KnownAction = (typeof Actions)[number];

export interface TransactionAction {
  protocol: string;

  chain: string;

  action: KnownAction;

  transactionHash: string;

  // log index format: logIndex:actionIndex
  // some protocol have multiple actions in a single log entry
  // so, to make a unique action, we need to combine longIndex with the actionIndex
  logIndex: string;

  blockNumber: number;

  // the transaction sender
  from: string;

  // the transaction recipient or called contract
  to: string;

  // the contract address that emitted this log
  contract: string;

  // a list of involve addresses
  // could be users, external address, periphery contracts
  addresses: Array<string>;

  // a list of tokens
  tokens: Array<Token>;

  // a list of token amounts
  // should match with tokens indies
  tokenAmounts: Array<string>;

  // some protocol return amount in USD
  usdAmounts?: Array<string>;

  // additional info
  addition?: any;
}

export interface TransactionInputDecoded {
  // the protocol that own the contract
  protocol: string;

  // the called method in contract
  method: string;

  // the abi was used to decode params
  abi: any;

  // decoded call params
  params: any;
}

export type TokenEIP = 'ERC20' | 'ERC721' | 'ERC1155';

export interface TokenTransfer {
  token: Token | NonFungibleToken;
  from: string;
  to: string;
  amount: string;
}

export interface TransactionInsight {
  chain: string;
  hash: string;

  // evm chains do not have transaction timestamp
  // this field will be injected from the block timestamp
  timestamp: number;

  // the raw transaction data returned from nodes
  rawdata: any;

  // the transaction receipt
  receipt: any;

  // all parsed actions
  actions: Array<TransactionAction>;

  // decoded transaction input
  inputDecoded: TransactionInputDecoded | null;

  // token transfer
  transfers: Array<TokenTransfer>;

  // found address labels
  addressLabels: { [key: string]: string };
}
