import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { type MarkdownReportRenderer, type StageType } from '../core/contracts.js';

export class DefaultMarkdownReportRenderer implements MarkdownReportRenderer {
  constructor(private readonly workspaceDir: string) {}

  async renderStage(sessionId: string, stage: StageType, payload: unknown): Promise<string> {
    const dir = path.join(this.workspaceDir, 'reports', sessionId);
    await mkdir(dir, { recursive: true });

    const filePath = path.join(dir, `${stage}.md`);
    const markdown = [
      `# ${stage.toUpperCase()} 报告`,
      '',
      `- Session: ${sessionId}`,
      `- Stage: ${stage}`,
      `- GeneratedAt: ${new Date().toISOString()}`,
      '',
      '```json',
      JSON.stringify(payload, null, 2),
      '```',
      ''
    ].join('\n');

    await writeFile(filePath, markdown, 'utf8');
    return filePath;
  }
}
