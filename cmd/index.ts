import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { TaskUpdateCommand } from './commands/taskUpdate';

(async function () {
  dotenv.config();

  const taskUpdate = new TaskUpdateCommand();

  yargs(process.argv.slice(2))
    .scriptName('rantomcore')
    .command(taskUpdate.name, taskUpdate.describe, taskUpdate.setOptions, taskUpdate.execute)
    .help().argv;
})();
