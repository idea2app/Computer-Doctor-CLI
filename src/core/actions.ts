import { $ } from 'zx';

import { type ActionExecution, RepairAction, type RuntimeContext } from './contracts.js';

export class HealthCheckAction extends RepairAction {
  id = 'health-check';
  title = '运行最小健康检查';

  async execute(_context: RuntimeContext, payload: Record<string, string>): Promise<ActionExecution> {
    const command = payload.command ?? 'node';
    const args = [payload.arg0 ?? '-e', payload.arg1 ?? "console.log('health-check-ok')"];
    const result = await $`${command} ${args}`;
    const output = result + '';

    return {
      actionId: this.id,
      success: true,
      output: output.trim(),
      rollbackHint: '该动作为只读健康检查，无需回滚。'
    };
  }
}
