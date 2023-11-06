import BigNumber from 'bignumber.js';
import Web3 from 'web3';

import { TokenList } from '../../configs';
import ERC20Abi from '../../configs/abi/ERC20.json';
import { AddressE, AddressF, AddressZero } from '../../configs/constants/addresses';
import { HardcodeTokens } from '../../configs/constants/hardcodeTokens';
import EnvConfig from '../../configs/envConfig';
import { compareAddress, normalizeAddress } from '../../lib/helper';
import logger from '../../lib/logger';
import { Token } from '../../types/configs';
import { CachingService } from '../caching/caching';
import { IDatabaseService } from '../database/domains';
import { ContractCall, GetTokenOptions, GetTransactionOptions, IBlockchainService } from './domains';

export default class BlockchainService extends CachingService implements IBlockchainService {
  public readonly name: string = 'blockchain';
  public readonly providers: { [key: string]: Web3 } = {};

  constructor(database: IDatabaseService | null) {
    super(database);

    for (const [chain, config] of Object.entries(EnvConfig.blockchains)) {
      this.providers[chain] = new Web3(config.nodeRpc);
    }
  }

  public getProvider(chain: string): Web3 {
    if (!this.providers[chain]) {
      // get config and initialize a new provider
      this.providers[chain] = new Web3(EnvConfig.blockchains[chain].nodeRpc);
    }

    return this.providers[chain];
  }

  public async getBlock(chain: string, blockNumber: number): Promise<any> {
    try {
      return await this.providers[chain].eth.getBlock(blockNumber);
    } catch (e: any) {
      logger.warn('failed to get block from blockchain', {
        service: this.name,
        chain: chain,
        blockNumber: blockNumber,
        error: e.message,
      });
    }

    return null;
  }

  public async getBlockTimestamp(chain: string, blockNumber: number): Promise<number> {
    const cachingKey = `block-timestamp-${chain}-${blockNumber}`;
    const caching = await this.getCachingData(cachingKey);
    if (caching) {
      return caching.timestamp;
    }

    try {
      const block = await this.providers[chain].eth.getBlock(blockNumber);
      const timestamp = Number(block.timestamp);
      await this.setCachingData(cachingKey, { timestamp });
      return timestamp;
    } catch (e: any) {
      logger.error('failed to get block from blockchain', {
        service: this.name,
        chain: chain,
        blockNumber: blockNumber,
        error: e.message,
      });
    }

    return 0;
  }

  public async getTokenInfo(options: GetTokenOptions): Promise<Token | null> {
    const { chain, onchain } = options;
    const address = normalizeAddress(options.address);

    if (!onchain) {
      // get from hard codes
      if (
        compareAddress(address, AddressZero) ||
        compareAddress(address, AddressE) ||
        compareAddress(address, AddressF)
      ) {
        return {
          chain: chain,
          address: normalizeAddress(address),
          ...EnvConfig.blockchains[chain].nativeToken,
        };
      }

      const key = `erc20-${chain}-${address}`;
      if (HardcodeTokens[key]) {
        return HardcodeTokens[key];
      }

      // get from static config
      if (TokenList[chain]) {
        for (const [, token] of Object.entries(TokenList[chain])) {
          if (compareAddress(address, token.address)) {
            return token;
          }
        }
      }

      if (this._database) {
        // get from database
        const tokenFromDatabase = await this._database.find({
          collection: EnvConfig.mongodb.collections.tokens,
          query: {
            chain: chain,
            address: normalizeAddress(address),
          },
        });
        if (tokenFromDatabase) {
          return {
            chain,
            address: normalizeAddress(address),
            symbol: tokenFromDatabase.symbol,
            decimals: tokenFromDatabase.decimals,
            logoURI: tokenFromDatabase.logoURI,
          };
        }
      }
    }

    // query on-chain data
    try {
      const [symbol, decimals] = await Promise.all([
        this.singlecall({
          chain: chain,
          target: address,
          abi: ERC20Abi,
          method: 'symbol',
          params: [],
        }),
        this.singlecall({
          chain: chain,
          target: address,
          abi: ERC20Abi,
          method: 'decimals',
          params: [],
        }),
      ]);

      const token: Token = {
        chain,
        address: normalizeAddress(address),
        symbol,
        decimals: new BigNumber(decimals.toString()).toNumber(),
      };

      if (this._database) {
        // save to database
        await this._database.update({
          collection: EnvConfig.mongodb.collections.tokens,
          keys: {
            chain: chain,
            address: token.address,
          },
          updates: {
            ...token,
          },
          upsert: true,
        });
      }

      return token;
    } catch (e: any) {
      logger.warn('failed to get token info', {
        service: this.name,
        chain: chain,
        token: address,
        error: e.message,
      });
    }

    return null;
  }

  public async getTransaction(options: GetTransactionOptions): Promise<any | null> {
    const transactionKey = `${options.chain}:${options.hash}`;
    const cache = await this.getCachingData(transactionKey);
    if (cache) {
      return cache.transaction;
    }

    try {
      const tx = await this.providers[options.chain].eth.getTransaction(options.hash);
      await this.setCachingData(transactionKey, {
        transaction: tx,
      });
      return tx;
    } catch (e: any) {
      return null;
    }
  }

  public async getTransactionReceipt(options: GetTransactionOptions): Promise<any | null> {
    try {
      return await this.providers[options.chain].eth.getTransactionReceipt(options.hash);
    } catch (e: any) {
      return null;
    }
  }

  public async singlecall(call: ContractCall): Promise<any> {
    const contract = new this.providers[call.chain].eth.Contract(call.abi, call.target);

    if (call.blockNumber) {
      return await contract.methods[call.method](...(call.params as [])).call({}, call.blockNumber);
    } else {
      return await contract.methods[call.method](...(call.params as [])).call();
    }
  }
}
