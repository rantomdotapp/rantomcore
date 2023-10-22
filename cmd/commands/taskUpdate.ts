import TokenHook from '../../modules/hooks/token';
import { ContextServices } from '../../types/namespaces';
import { BasicCommand } from '../basic';

export class TaskUpdateCommand extends BasicCommand {
  public readonly name: string = 'taskUpdate';
  public readonly describe: string = 'Run data utilities updating task';

  constructor() {
    super();
  }

  public async execute(argv: any) {
    const services: ContextServices = await super.getServices();

    const tokenHook = new TokenHook(services);

    await tokenHook.run({});

    process.exit(0);
  }

  public setOptions(yargs: any) {
    return yargs.option({});
  }
}
