import BigNumber from 'bignumber.js';
import { Web3 } from 'web3';

import { TokenList } from '../../configs';
import ERC20Abi from '../../configs/abi/ERC20.json';
import { AddressE, AddressF, AddressZero } from '../../configs/constants/addresses';
import EnvConfig from '../../configs/envConfig';
import { compareAddress, normalizeAddress } from '../../lib/helper';
import { Token } from '../../types/configs';
import { CachingService } from '../caching/caching';
import { IDatabaseService } from '../database/domains';
import { ContractCall, GetTokenErc20Options, IBlockchainService } from './domains';

export default class BlockchainService extends CachingService implements IBlockchainService {
  public readonly name: string = 'blockchain';
  public readonly providers: { [key: string]: Web3 } = {};

  constructor(database: IDatabaseService | null) {
    super(database);

    for (const [name, config] of Object.entries(EnvConfig.blockchains)) {
      this.providers[name] = new Web3(config.nodeRpc) as Web3;
    }
  }

  public async getTokenErc20Info(options: GetTokenErc20Options): Promise<Token> {
    const { chain, address, onchain } = options;

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
