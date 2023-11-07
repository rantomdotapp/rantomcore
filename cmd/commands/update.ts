import { sleep } from '../../lib/helper';
import { getAdapters } from '../../modules/adapters';
import { ContextServices, IUpdater } from '../../types/namespaces';
import { BasicCommand } from '../basic';

export class UpdateCommand extends BasicCommand {
  public readonly name: string = 'update';
  public readonly describe: string = 'Run protocols data updater services';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services: ContextServices = await super.getServices();
    await super.preHook(services);

    const adapters = getAdapters(services);

    while (true) {
      if (argv.protocol === '' || adapters[argv.protocol]) {
        if (adapters[argv.protocol].updaters) {
          for (const updater of adapters[argv.protocol].updaters) {
            await (updater as IUpdater).runUpdate({});
          }
        }
      }

      if (argv.exit) {
        process.exit(0);
      }

      await sleep(argv.sleep ? Number(argv.sleep) : 300);
    }
  }

  public setOptions(yargs: any) {
    return yargs.option({
      protocol: {
        type: 'string',
        default: '',
        describe: 'Run indexing service with a given protocol only.',
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
