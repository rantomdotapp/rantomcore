export interface BlockchainIndexingRunOptions {
  chain: string;

  // force to sync from the contract birthBlock
  fromBlock: number;
}

export interface HandleHookEventLogOptions {
  chain: string;
  log: any;
}
