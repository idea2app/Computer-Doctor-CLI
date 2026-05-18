import { $ } from 'zx';

export class ZxCommandRunner {
  constructor(private readonly verbose: boolean) {}

  async run(command: string, args: string[] = []): Promise<string> {
    const result = await $({ quiet: !this.verbose })`${command} ${args}`;
    return `${result.stdout}`.trim();
  }
}
