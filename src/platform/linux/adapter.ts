import os from 'node:os';
import { type DiagnosticSnapshot, type PlatformAdapter, type RuntimeContext } from '../../core/contracts.js';

export class LinuxPlatformAdapter implements PlatformAdapter {
  readonly id = 'linux';

  supportsCurrentPlatform(): boolean {
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
