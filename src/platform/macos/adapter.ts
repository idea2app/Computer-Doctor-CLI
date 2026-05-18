import os from 'node:os';
import { type DiagnosticSnapshot, type PlatformAdapter, type RuntimeContext } from '../../core/contracts.js';

export class MacOSPlatformAdapter implements PlatformAdapter {
  readonly id = 'macos';

  supportsCurrentPlatform(): boolean {
    return process.platform === 'darwin';
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
