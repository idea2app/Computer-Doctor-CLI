import 'reflect-metadata';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';

import { HealthCheckAction } from '../src/core/actions.js';
import { DefaultActionExecutor } from '../src/core/action-executor.js';
import { DefaultDiagnosticProvider } from '../src/core/diagnostic-provider.js';
import { createAppDataSource } from '../src/infra/store/data-source.js';
import { Session, StageRecord } from '../src/infra/store/entities.js';
import { TypeormSessionStore } from '../src/infra/store/typeorm-session-store.js';
import { VercelAIPlanGenerator } from '../src/infra/llm/vercel-ai-plan-generator.js';
import { DefaultMarkdownReportRenderer } from '../src/report/markdown-report-renderer.js';
import { runMVPFlow } from '../src/workflow/mvp-runner.js';

const tempDirs: string[] = [];

afterEach(async () => {
  for (const dir of tempDirs.splice(0)) await rm(dir, { recursive: true, force: true });
});

test('runs MVP flow and persists markdown + sqlite data', async () => {
  const workspaceDir = await mkdtemp(path.join(os.tmpdir(), 'computer-doctor-'));
  tempDirs.push(workspaceDir);

  const dataSource = createAppDataSource(workspaceDir);

  const result = await runMVPFlow(
    { verbose: false, workspaceDir },
    {
      diagnosticProvider: new DefaultDiagnosticProvider(),
      planGenerator: new VercelAIPlanGenerator(),
      actionExecutor: new DefaultActionExecutor([new HealthCheckAction()]),
      sessionStore: new TypeormSessionStore(dataSource),
      reportRenderer: new DefaultMarkdownReportRenderer(workspaceDir)
    }
  );

  assert.equal(result.actionCount, 1);

  const stageFiles = await Promise.all([
    readFile(result.reports.diagnostic, 'utf8'),
    readFile(result.reports.plan, 'utf8'),
    readFile(result.reports.repair, 'utf8'),
    readFile(result.reports.rollback, 'utf8')
  ]);

  for (const content of stageFiles) {
    assert.match(content, /# [A-Z]+ 报告/);
    assert.match(content, /Session:/);
  }

  const sessionCount = await dataSource.getRepository(Session).count();
  const stageCount = await dataSource.getRepository(StageRecord).count();

  assert.equal(sessionCount, 1);
  assert.equal(stageCount, 4);

  await dataSource.destroy();
});
