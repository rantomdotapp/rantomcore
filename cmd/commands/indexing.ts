import { DefaultBlockNumberIndexingFrom } from '../../configs';
import envConfig from '../../configs/envConfig';
import EnvConfig from '../../configs/envConfig';
import { sleep } from '../../lib/helper';
import BlockchainIndexing from '../../modules/indexing/blockchain';
import { ContextServices, IBlockchainIndexing } from '../../types/namespaces';
import { BasicCommand } from '../basic';

export class IndexCommand extends BasicCommand {
  public readonly name: string = 'index';
  public readonly describe: string = 'Run blockchains or protocols indexing services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services: ContextServices = await super.getServices();

    const indexing: IBlockchainIndexing = new BlockchainIndexing(services);

    // connect database
    await services.database.connect(envConfig.mongodb.connectionUri, envConfig.mongodb.databaseName);

    while (true) {
      await indexing.run({
        chain: argv.chain,
        fromBlock: argv.fromBlock
          ? argv.fromBlock
          : DefaultBlockNumberIndexingFrom[argv.chain]
          ? DefaultBlockNumberIndexingFrom[argv.chain]
          : 0,
      });

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(argv.sleep ? Number(argv.sleep) : 300);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      chain: {
        type: 'string',
        default: 'ethereum',
        describe: `The blockchain name to index, support: ${Object.keys(EnvConfig.blockchains).toString()}`,
      },
      fromBlock: {
        type: 'number',
        default: 0,
        describe: 'Give a block number where the data will be indexed from.',
      },
      exit: {
        type: 'boolean',
        default: false,
        describe: 'Do not run services as workers.',
      },
      sleep: {
        type: 'number',
        default: 300, // 5 minutes
        describe: 'Given amount of seconds to sleep after every sync round. Default is 5 minutes.',
      },
    });
  }
}
