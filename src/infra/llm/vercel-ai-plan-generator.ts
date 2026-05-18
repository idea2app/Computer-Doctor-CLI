import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { type DiagnosticSnapshot, type PlanGenerator, type RepairPlan, type RuntimeContext } from '../../core/contracts.js';

const FALLBACK_PLAN: RepairPlan = {
  summary: '执行最小健康检查动作，验证修复链路可执行。',
  actions: [
    {
      id: 'health-check',
      title: '运行最小健康检查',
      payload: { command: 'node', arg0: '-e', arg1: "console.log('health-check-ok')" }
    }
  ]
};

export class VercelAIPlanGenerator implements PlanGenerator {
  async generatePlan(input: DiagnosticSnapshot, _context: RuntimeContext): Promise<RepairPlan> {
    if (!process.env.OPENAI_API_KEY) {
      return FALLBACK_PLAN;
    }

    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: [
        '你是电脑维修助手。',
        '请基于输入诊断信息输出 JSON：{"summary": string, "actions": [{"id": "health-check", "title": string, "payload": {"command": "node", "arg0": "-e", "arg1": "console.log(\\"health-check-ok\\")"}}]}。',
        '只能使用 id=health-check，不能生成其他命令。',
        `输入: ${JSON.stringify(input)}`
      ].join('\n')
    });

    try {
      const parsed = JSON.parse(text) as RepairPlan;
      if (!Array.isArray(parsed.actions) || parsed.actions.length === 0) {
        return FALLBACK_PLAN;
      }

      const onlyKnownActions = parsed.actions.every(action => action.id === 'health-check');
      return onlyKnownActions ? parsed : FALLBACK_PLAN;
    } catch {
      return FALLBACK_PLAN;
    }
  }
}
