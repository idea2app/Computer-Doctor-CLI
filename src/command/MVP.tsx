import { render } from 'ink';

import { HealthCheckAction } from '../core/actions.js';
import { DefaultActionExecutor } from '../core/action-executor.js';
import { DefaultDiagnosticProvider } from '../core/diagnostic-provider.js';
import { type RuntimeContext } from '../core/contracts.js';
import { createAppDataSource } from '../infra/store/data-source.js';
import { TypeormSessionStore } from '../infra/store/typeorm-session-store.js';
import { VercelAIPlanGenerator } from '../infra/llm/vercel-ai-plan-generator.js';
import { DefaultMarkdownReportRenderer } from '../report/markdown-report-renderer.js';
import { RunSummary } from '../ui/run-summary.js';
import { runMVPFlow } from '../workflow/mvp-runner.js';

export async function runMVPCommand(context: RuntimeContext & { verbose?: boolean }) {
  const dataSource = createAppDataSource(context.workspaceDir);
  const sessionStore = new TypeormSessionStore(dataSource);

  const result = await runMVPFlow(context, {
    diagnosticProvider: new DefaultDiagnosticProvider(),
    planGenerator: new VercelAIPlanGenerator(),
    actionExecutor: new DefaultActionExecutor([new HealthCheckAction()]),
    sessionStore,
    reportRenderer: new DefaultMarkdownReportRenderer(context.workspaceDir)
  });

  render(<RunSummary result={result} verbose={!!context.verbose} />);

  await dataSource.destroy();
}
