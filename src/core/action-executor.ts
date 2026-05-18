import { ActionExecutor, type ActionExecution, RepairAction, type RepairPlan, type RuntimeContext } from './contracts.js';

export class DefaultActionExecutor extends ActionExecutor {
  readonly actionMap: Map<string, RepairAction>;

  constructor(actions: RepairAction[]) {
    super();
    this.actionMap = new Map(actions.map(action => [action.id, action]));
  }

  async execute(context: RuntimeContext, plan: RepairPlan): Promise<ActionExecution[]> {
    const executions: ActionExecution[] = [];

    for (const { id, payload } of plan.actions) {
      const handler = this.actionMap.get(id);

      if (!handler) {
        executions.push({
          actionId: id,
          success: false,
          output: `Unknown action: ${id}`,
          rollbackHint: '无法执行未知动作，请人工审查。'
        });
        continue;
      }

      executions.push(await handler.execute(context, payload));
    }

    return executions;
  }
}
