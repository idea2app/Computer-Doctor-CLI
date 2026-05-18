import { type PlatformAdapter } from '../core/contracts.js';
import { LinuxPlatformAdapter } from './linux/adapter.js';
import { MacOSPlatformAdapter } from './macos/adapter.js';
import { WindowsPlatformAdapter } from './windows/adapter.js';

export function createPlatformAdapters(): PlatformAdapter[] {
  return [new WindowsPlatformAdapter(), new LinuxPlatformAdapter(), new MacOSPlatformAdapter()];
}

export function selectCurrentAdapter(adapters: PlatformAdapter[]): PlatformAdapter {
  const matched = adapters.find(adapter => adapter.supportsCurrentPlatform());

  if (!matched) {
    throw new Error(`No platform adapter for ${process.platform}`);
  }

  return matched;
}
