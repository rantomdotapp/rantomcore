import { Collection, MongoClient } from 'mongodb';

import envConfig from '../../configs/envConfig';
import { sleep } from '../../lib/helper';
import logger from '../../lib/logger';
import { DatabaseBulkWriteOptions, DatabaseQueryOptions, DatabaseUpdateOptions, IDatabaseService } from './domains';

export default class DatabaseService implements IDatabaseService {
  public readonly name: string = 'database';

  private _connected: boolean = false;
  private _client: MongoClient | null = null;
  private _db: any = null;

  constructor() {}

  public async connect(url: string, name: string) {
    if (!this._connected) {
      this._client = new MongoClient(url);

      while (!this._connected) {
        try {
          await this._client?.connect();
          this._db = this._client?.db(name);
          this._connected = true;

          await this.setupIndies();

          logger.info('database connected', {
            service: this.name,
            name: name,
          });
        } catch (e: any) {
          logger.error('failed to connect database', {
            service: this.name,
            name: name,
            error: e.message,
          });
          await sleep(5);
        }
      }

      if (!this._connected) {
        this.onError(Error('failed to connect to database'));
      }
    }
  }

  private async getCollection(name: string): Promise<Collection> {
    let collection: Collection | null = null;
    if (this._connected) {
      collection = this._db ? this._db.collection(name) : null;
    } else {
      this.onError(Error('failed to get collection'));
    }

    if (!collection) {
      this.onError(Error('failed to get collection'));
      process.exit(1);
    }

    return collection;
  }

  public onError(error: Error): void {
    console.error(error);
    process.exit(1);
  }

  private async setupIndies(): Promise<void> {
    const statesCollection = await this.getCollection(envConfig.mongodb.collections.states);
    const cachingCollection = await this.getCollection(envConfig.mongodb.collections.caching);
    const rawlogsCollection = await this.getCollection(envConfig.mongodb.collections.rawlogs);
    const tokensCollection = await this.getCollection(envConfig.mongodb.collections.tokens);
    const contractsCollection = await this.getCollection(envConfig.mongodb.collections.contracts);
    const liquidityPoolsCollection = await this.getCollection(envConfig.mongodb.collections.liquidityPools);

    statesCollection.createIndex({ name: 1 }, { background: true });
    cachingCollection.createIndex({ name: 1 }, { background: true });

    // for write documents
    rawlogsCollection.createIndex({ chain: 1, address: 1, transactionHash: 1, logIndex: 1 }, { background: true });
    rawlogsCollection.createIndex({ chain: 1, address: 1, blockNumber: 1 }, { background: true });

    // for write documents
    tokensCollection.createIndex({ chain: 1, address: 1 }, { background: true });

    // for write documents
    contractsCollection.createIndex({ chain: 1, address: 1 }, { background: true });

    // for write
    liquidityPoolsCollection.createIndex({ chain: 1, address: 1 }, { background: true });
  }

  public async bulkWrite(options: DatabaseBulkWriteOptions): Promise<void> {
    const collection = await this.getCollection(options.collection);
    await collection.bulkWrite(options.operations);
  }

  public async find(options: DatabaseQueryOptions): Promise<any> {
    const collection = await this.getCollection(options.collection);
    return await collection.findOne({
      ...options.query,
    });
  }

  public async query(options: DatabaseQueryOptions): Promise<Array<any>> {
    const collection = await this.getCollection(options.collection);
    return await collection
      .find({
        ...options.query,
      })
      .toArray();
  }

  public async update(options: DatabaseUpdateOptions): Promise<void> {
    const collection = await this.getCollection(options.collection);
    await collection.updateMany(
      {
        ...options.keys,
      },
      {
        $set: {
          ...options.updates,
        },
      },
      {
        upsert: options.upsert,
      },
    );
  }
}
