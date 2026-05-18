import { Command } from 'commander-jsx';
import { type Data } from 'commander-jsx';
import { runCommand } from './cli/run-command.js';

const rawArgs = process.argv.slice(2);
const globalVerbose = rawArgs.includes('--verbose') || rawArgs.includes('-V');
const cliArgs = rawArgs.filter(arg => arg !== '--verbose' && arg !== '-V');

void Command.execute(
  <Command
    name="computer-doctor"
    version="0.1.0"
    parameters="[command]"
    description="面向电脑维修技术员的跨平台 CLI 修复 Agent MVP"
  >
    <Command
      name="run"
      description="Run the MVP diagnostic -> planning -> repair -> rollback loop"
      options={{
        verbose: {
          shortcut: 'V',
          description: 'Enable verbose mode'
        },
        workspace: {
          shortcut: 'w',
          parameters: '<path>',
          description: 'Workspace directory for SQLite and Markdown outputs'
        }
      }}
      executor={async (options: { verbose?: Data; workspace?: Data }) => {
        const verbose = globalVerbose || options.verbose === true || options.verbose === 'true';
        const workspace = typeof options.workspace === 'string' ? options.workspace : process.cwd();
        await runCommand({
          verbose,
          workspaceDir: workspace
        });
      }}
    />
  </Command>,
  cliArgs
);
