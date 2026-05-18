import { type ActionExecutor, type DiagnosticProvider, type MarkdownReportRenderer, type PlanGenerator, type RuntimeContext, type SessionStore } from '../core/contracts.js';
import { createPlatformAdapters, selectCurrentAdapter } from '../platform/registry.js';

export interface MVPFlowResult {
  sessionId: string;
  platform: string;
  reports: Record<string, string>;
  actionCount: number;
}

export interface MVPDependencies {
  diagnosticProvider: DiagnosticProvider;
  planGenerator: PlanGenerator;
  actionExecutor: ActionExecutor;
  sessionStore: SessionStore;
  reportRenderer: MarkdownReportRenderer;
}

export async function runMVPFlow(context: RuntimeContext, deps: MVPDependencies): Promise<MVPFlowResult> {
  const adapter = selectCurrentAdapter(createPlatformAdapters());

  await deps.sessionStore.initialize();
  const session = await deps.sessionStore.createSession(adapter.id);

  try {
    const diagnostic = await deps.diagnosticProvider.collect(context, adapter);
    const diagnosticReport = await deps.reportRenderer.renderStage(session.id, 'diagnostic', diagnostic);
    await deps.sessionStore.appendStage(session.id, 'diagnostic', diagnostic, diagnosticReport);

    const plan = await deps.planGenerator.generatePlan(diagnostic, context);
    const planReport = await deps.reportRenderer.renderStage(session.id, 'plan', plan);
    await deps.sessionStore.appendStage(session.id, 'plan', plan, planReport);

    const repairs = await deps.actionExecutor.execute(context, plan);
    const repairReport = await deps.reportRenderer.renderStage(session.id, 'repair', repairs);
    await deps.sessionStore.appendStage(session.id, 'repair', repairs, repairReport);

    const rollback = repairs.map(item => ({ actionId: item.actionId, rollbackHint: item.rollbackHint }));
    const rollbackReport = await deps.reportRenderer.renderStage(session.id, 'rollback', rollback);
    await deps.sessionStore.appendStage(session.id, 'rollback', rollback, rollbackReport);

    await deps.sessionStore.updateSessionStatus(session.id, 'completed');

    return {
      sessionId: session.id,
      platform: adapter.id,
      reports: {
        diagnostic: diagnosticReport,
        plan: planReport,
        repair: repairReport,
        rollback: rollbackReport
      },
      actionCount: repairs.length
    };
  } catch (error) {
    await deps.sessionStore.updateSessionStatus(session.id, 'failed');
    throw error;
  }
}
