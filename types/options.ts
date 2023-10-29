export interface BlockchainIndexingRunOptions {
  chain: string;

  // force to sync from the contract birthBlock
  fromBlock: number;
}

export interface HandleHookEventLogOptions {
  chain: string;
  log: any;
}

export interface SubgraphIndexingRunOptions {
  // null means run all available configs
  protocol: string | null;
}

export interface ParseTransactionOptions {
  chain?: string;
  hash: string;
}

export interface ParseEventLogOptions {
  chain: string;

  // the transaction where the log was emitted
  transaction: any;

  // full list of logs were emitted in the same transaction
  // some protocol need these logs
  allLogs: Array<any>;

  // the main log entry
  log: any;
}
