import os from 'node:os';

import { type DiagnosticSnapshot, PlatformAdapter, type RuntimeContext } from '../../core/contracts.js';

export class WindowsPlatformAdapter extends PlatformAdapter {
  id = 'windows';

  supportsCurrentPlatform() {
    return process.platform === 'win32';
  }

  async collectDiagnostics(_context: RuntimeContext): Promise<DiagnosticSnapshot> {
    return {
      platform: this.id,
      hostname: os.hostname(),
      osVersion: `${os.type()} ${os.release()}`,
      nodeVersion: process.version,
      collectedAt: new Date().toISOString()
    };
  }
}
