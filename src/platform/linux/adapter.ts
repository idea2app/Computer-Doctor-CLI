import os from 'node:os';

import { type DiagnosticSnapshot, PlatformAdapter, type RuntimeContext } from '../../core/contracts.js';

export class LinuxPlatformAdapter extends PlatformAdapter {
  id = 'linux';

  supportsCurrentPlatform() {
    return process.platform === 'linux';
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
