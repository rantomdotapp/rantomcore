import { IBlockchainService } from '../services/blockchains/domains';
import { IDatabaseService } from '../services/database/domains';
import { ProtocolConfig } from './configs';
import { TokenTransfer, TransactionAction, TransactionInsight } from './domains';
import {
  BlockchainIndexingRunOptions,
  HandleHookEventLogOptions,
  ParseEventLogOptions,
  ParseTransactionOptions,
  ProtocolIndexingRunOptions,
  UpdaterRunUpdateOptions,
} from './options';

export interface ContextServices {
  database: IDatabaseService;
  blockchain: IBlockchainService;
}

export interface IModule {
  name: string;
  services: ContextServices;
}

// every protocol have some constant configs and info
// this service suppose to query on-chain data and save them to database
// for faster query when parsing event logs
export interface IUpdater extends IModule {
  config: ProtocolConfig;

  runUpdate: (options: UpdaterRunUpdateOptions) => Promise<void>;
}

export interface IAdapter extends IModule {
  config: ProtocolConfig;

  // if the updater was given
  // it will be auto run when run the updater
  updaters: Array<IUpdater>;

  // every adapter should support a list of log signatures
  supportedSignature: (signature: string) => boolean;

  // every adapter should support a list of contract address
  supportedContract: (chain: string, address: string) => boolean;

  // when index logs from blockchain, we forward raw logs to every single adapter
  // if the adapter recognize the log signature (topic 0)
  // this function should handle all necessary tasks.
  // ex, when uniswap adapter got the log with signature:
  // 0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9
  // this function parses the log and save liquidity pool data into database
  handleEventLog: (options: HandleHookEventLogOptions) => Promise<void>;

  // parse an event log into list of transaction actions
  parseEventLog: (options: ParseEventLogOptions) => Promise<Array<TransactionAction>>;
}

export interface ITransferAdapter extends IModule {
  // every adapter should support a list of log signatures
  supportedSignature: (signature: string) => boolean;

  // parse an event log into list of transaction token transfers
  parseEventLog: (options: ParseEventLogOptions) => Promise<TokenTransfer | null>;
}

// this indexing service query all logs from blockchain in a range
// after that, it passes them into every single adapter hooks to handle logs
export interface IBlockchainIndexing extends IModule {
  run: (options: BlockchainIndexingRunOptions) => Promise<void>;
}

// index historical data of a given protocol
// it uses contracts configs from protocol config
export interface IProtocolIndexing extends IModule {
  run: (options: ProtocolIndexingRunOptions) => Promise<void>;
}

// the entry point for parser service
export interface ITransactionParser extends IModule {
  parseTransaction: (options: ParseTransactionOptions) => Promise<Array<TransactionInsight>>;
}
