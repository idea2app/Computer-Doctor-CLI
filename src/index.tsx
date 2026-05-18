/** @jsxImportSource commander-jsx */
import 'reflect-metadata';
import { Command } from 'commander-jsx';
import { $ } from 'zx';

import { runMVPCommand } from './command/MVP.js';

const verbose = {
  shortcut: 'V',
  description: 'Enable verbose mode'
};

Command.execute(
  <Command
    name="computer-doctor"
    version="0.1.0"
    parameters="[command]"
    description="面向电脑维修技术员的跨平台 CLI 修复 Agent MVP"
  >
    <Command
      name="mvp"
      description="Run the MVP diagnostic -> planning -> repair -> rollback loop"
      options={{
        verbose,
        workspace: {
          shortcut: 'w',
          parameters: '<path>',
          description: 'Workspace directory for SQLite and Markdown outputs'
        }
      }}
      executor={async ({ verbose, workspace }) => {
        const oldVerbose = $.verbose;
        $.verbose = !!verbose;

        const workspaceDir = typeof workspace === 'string' ? workspace : process.cwd();

        await runMVPCommand({ workspaceDir, verbose: !!verbose });

        $.verbose = oldVerbose;
      }}
    />
  </Command>,
  process.argv.slice(2)
).then(
  () => process.exit(),
  error => {
    console.error(error);
    process.exit(1);
  }
);
