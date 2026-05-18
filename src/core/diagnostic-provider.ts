import { type DiagnosticProvider, type DiagnosticSnapshot, type PlatformAdapter, type RuntimeContext } from './contracts.js';

export class DefaultDiagnosticProvider implements DiagnosticProvider {
  async collect(context: RuntimeContext, adapter: PlatformAdapter): Promise<DiagnosticSnapshot> {
    return adapter.collectDiagnostics(context);
  }
}
