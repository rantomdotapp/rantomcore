import BigNumber from 'bignumber.js';
import { Web3 } from 'web3';

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
import { ContractCall, GetTokenOptions, IBlockchainService } from './domains';

export default class BlockchainService extends CachingService implements IBlockchainService {
  public readonly name: string = 'blockchain';
  public readonly providers: { [key: string]: Web3 } = {};

  constructor(database: IDatabaseService | null) {
    super(database);

    for (const [name, config] of Object.entries(EnvConfig.blockchains)) {
      this.providers[name] = new Web3(config.nodeRpc) as Web3;
    }
  }

  public getProvider(chain: string): Web3 {
    return this.providers[chain];
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

  public async singlecall(call: ContractCall): Promise<any> {
    const contract = new this.providers[call.chain].eth.Contract(call.abi, call.target);

    if (call.blockNumber) {
      return await contract.methods[call.method](...(call.params as [])).call({}, call.blockNumber);
    } else {
      return await contract.methods[call.method](...(call.params as [])).call();
    }
  }
}
