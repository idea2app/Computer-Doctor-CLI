import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { MarkdownReportRenderer, type StageType } from '../core/contracts.js';

export class DefaultMarkdownReportRenderer extends MarkdownReportRenderer {
  constructor(private readonly workspaceDir: string) {
    super();
  }

  async renderStage(sessionId: string, stage: StageType, payload: unknown): Promise<string> {
    const dir = join(this.workspaceDir, 'reports', sessionId);
    await mkdir(dir, { recursive: true });

    const filePath = join(dir, `${stage}.md`);
    const markdown = `# ${stage.toUpperCase()} 报告

- Session: ${sessionId}
- Stage: ${stage}
- GeneratedAt: ${new Date().toISOString()}

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\`
`;

    await writeFile(filePath, markdown, 'utf8');

    return filePath;
  }
}
