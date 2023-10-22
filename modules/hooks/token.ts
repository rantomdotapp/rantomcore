import { TokenList } from '../../configs';
import EnvConfig from '../../configs/envConfig';
import { ContextServices } from '../../types/namespaces';
import { ITokenHook } from './domains';

export default class TokenHook implements ITokenHook {
  public readonly name: string = 'hook.token';
  public readonly services: ContextServices;

  constructor(services: ContextServices) {
    this.services = services;
  }

  public async run(options: any): Promise<void> {
    // firstly, we save tokens data from configs into database
    const operations: Array<any> = [];
    for (const [, tokenList] of Object.entries(TokenList)) {
      for (const [, token] of Object.entries(tokenList)) {
        operations.push({
          updateOne: {
            filter: {
              chain: token.chain,
              address: token.address,
            },
            update: {
              $set: {
                chain: token.chain,
                address: token.address,
                symbol: token.symbol,
                decimals: token.decimals,
                logoURI: token.logoURI,
              },
            },
            upsert: true,
          },
        });
      }
    }

    await this.services.database.bulkWrite({
      collection: EnvConfig.mongodb.collections.tokens,
      operations: operations,
    });

    return;
  }
}
