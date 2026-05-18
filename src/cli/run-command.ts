import { render } from 'ink';
import React from 'react';
import { HealthCheckAction } from '../core/actions.js';
import { DefaultActionExecutor } from '../core/action-executor.js';
import { DefaultDiagnosticProvider } from '../core/diagnostic-provider.js';
import { createAppDataSource } from '../infra/db/data-source.js';
import { TypeormSessionStore } from '../infra/db/typeorm-session-store.js';
import { VercelAIPlanGenerator } from '../infra/llm/vercel-ai-plan-generator.js';
import { DefaultMarkdownReportRenderer } from '../report/markdown-report-renderer.js';
import { RunSummary } from '../ui/run-summary.js';
import { runMVPFlow } from '../workflow/mvp-runner.js';
import { type RuntimeContext } from '../core/contracts.js';

export async function runCommand(context: RuntimeContext): Promise<void> {
  const dataSource = createAppDataSource(context.workspaceDir);
  const sessionStore = new TypeormSessionStore(dataSource);

  const result = await runMVPFlow(context, {
    diagnosticProvider: new DefaultDiagnosticProvider(),
    planGenerator: new VercelAIPlanGenerator(),
    actionExecutor: new DefaultActionExecutor([new HealthCheckAction()]),
    sessionStore,
    reportRenderer: new DefaultMarkdownReportRenderer(context.workspaceDir)
  });

  render(React.createElement(RunSummary, { result, verbose: context.verbose }));

  await dataSource.destroy();
}
