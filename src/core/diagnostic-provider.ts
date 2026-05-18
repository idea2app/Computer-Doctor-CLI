import { DiagnosticProvider, type DiagnosticSnapshot, PlatformAdapter, type RuntimeContext } from './contracts.js';

export class DefaultDiagnosticProvider extends DiagnosticProvider {
  collect(context: RuntimeContext, adapter: PlatformAdapter): Promise<DiagnosticSnapshot> {
    return adapter.collectDiagnostics(context);
  }
}
