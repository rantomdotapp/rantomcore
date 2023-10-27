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
