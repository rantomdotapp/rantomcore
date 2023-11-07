import dotenv from 'dotenv';
import yargs from 'yargs/yargs';

import { IndexCommand } from './commands/indexing';
import { ServeCommand } from './commands/serve';
import { UpdateCommand } from './commands/update';

(async function () {
  dotenv.config();

  const serveCommand = new ServeCommand();
  const indexCommand = new IndexCommand();
  const updateCommand = new UpdateCommand();

  yargs(process.argv.slice(2))
    .scriptName('rantomcore')
    .command(serveCommand.name, serveCommand.describe, serveCommand.setOptions, serveCommand.execute)
    .command(indexCommand.name, indexCommand.describe, indexCommand.setOptions, indexCommand.execute)
    .command(updateCommand.name, updateCommand.describe, updateCommand.setOptions, updateCommand.execute)
    .help().argv;
})();
