import { IDatabaseService } from '../services/database/domains';

export interface ContextServices {
  database: IDatabaseService;
}

export interface IModule {
  name: string;
  services: ContextServices;
}

// sometime, before we do something, we need do something first
// hook is basically some tasks need to be done before
// we run main module
// ex: before we can index logs from a given blockchain
// we need query and update some tokens data for faster indexing
export interface IHooking extends IModule {
  // every hook can require different options
  // and return different data
  run: (options: any) => Promise<any>;
}
