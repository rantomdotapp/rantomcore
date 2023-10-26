import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { IndexCommand } from './commands/indexing';

(async function () {
  dotenv.config();

  const indexCommand = new IndexCommand();

  yargs(process.argv.slice(2))
    .scriptName('rantomcore')
    .command(indexCommand.name, indexCommand.describe, indexCommand.setOptions, indexCommand.execute)
    .help().argv;
})();
