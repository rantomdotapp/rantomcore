import EnvConfig from '../../configs/envConfig';
import { sleep } from '../../lib/helper';
import BlockchainIndexing from '../../modules/indexing/blockchain';
import FactoryIndexing from '../../modules/indexing/factory';
import SubgraphIndexing from '../../modules/indexing/subgraph';
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
    await super.preHook(services);

    while (true) {
      if (argv.type === 'subgraph') {
        const indexing = new SubgraphIndexing(services);
        await indexing.run({ protocol: argv.protocol });
      } else if (argv.type === 'factory') {
        const indexing = new FactoryIndexing(services);
        await indexing.run({ protocol: argv.protocol });
      } else {
        const indexing: IBlockchainIndexing = new BlockchainIndexing(services);
        await indexing.run({
          chain: argv.chain,
          fromBlock: argv.fromBlock,
        });
      }

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(argv.sleep ? Number(argv.sleep) : 300);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      type: {
        type: 'string',
        default: 'blockchain',
        describe: 'Given indexing service type: blockchain, subgraph, factory, or contract.',
      },
      chain: {
        type: 'string',
        default: 'ethereum',
        describe: `The blockchain name to index, support: ${Object.keys(EnvConfig.blockchains).toString()}`,
      },
      protocol: {
        type: 'string',
        default: '',
        describe: 'Run indexing service with a given protocol only.',
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
