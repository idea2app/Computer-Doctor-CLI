import { type ActionExecution, type RepairAction, type RuntimeContext } from './contracts.js';
import { ZxCommandRunner } from '../infra/shell/zx-command-runner.js';

export class HealthCheckAction implements RepairAction {
  readonly id = 'health-check';
  readonly title = '运行最小健康检查';

  async execute(context: RuntimeContext, payload: Record<string, string>): Promise<ActionExecution> {
    const command = payload.command ?? 'node';
    const args = [payload.arg0 ?? '-e', payload.arg1 ?? "console.log('health-check-ok')"];
    const runner = new ZxCommandRunner(context.verbose);

    const output = await runner.run(command, args);

    return {
      actionId: this.id,
      success: true,
      output,
      rollbackHint: '该动作为只读健康检查，无需回滚。'
    };
  }
}
