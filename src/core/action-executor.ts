import { type ActionExecution, type ActionExecutor, type RepairAction, type RepairPlan, type RuntimeContext } from './contracts.js';

export class DefaultActionExecutor implements ActionExecutor {
  private readonly actionMap: Map<string, RepairAction>;

  constructor(actions: RepairAction[]) {
    this.actionMap = new Map(actions.map(action => [action.id, action]));
  }

  async execute(context: RuntimeContext, plan: RepairPlan): Promise<ActionExecution[]> {
    const executions: ActionExecution[] = [];

    for (const action of plan.actions) {
      const handler = this.actionMap.get(action.id);
      if (!handler) {
        executions.push({
          actionId: action.id,
          success: false,
          output: `Unknown action: ${action.id}`,
          rollbackHint: '无法执行未知动作，请人工审查。'
        });
        continue;
      }

      executions.push(await handler.execute(context, action.payload));
    }

    return executions;
  }
}
