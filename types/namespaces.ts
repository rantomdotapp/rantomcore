import { IBlockchainService } from '../services/blockchains/domains';
import { IDatabaseService } from '../services/database/domains';
import { ProtocolConfig } from './configs';
import { BlockchainIndexingRunOptions, HandleHookEventLogOptions } from './options';

export interface ContextServices {
  database: IDatabaseService;
  blockchain: IBlockchainService;
}

export interface IModule {
  name: string;
  services: ContextServices;
}

export interface IAdapter extends IModule {
  config: ProtocolConfig;

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
  handleHookEventLog: (options: HandleHookEventLogOptions) => Promise<void>;
}

// this indexing service query all logs from blockchain in a range
// after that, it passes them into every single adapter hooks to handle logs
export interface IBlockchainIndexing extends IModule {
  run: (options: BlockchainIndexingRunOptions) => Promise<void>;
}
