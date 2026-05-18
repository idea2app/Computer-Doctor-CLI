export type StageType = 'diagnostic' | 'plan' | 'repair' | 'rollback';

export interface RuntimeContext {
  verbose: boolean;
  workspaceDir: string;
}

export interface DiagnosticSnapshot {
  platform: string;
  hostname: string;
  osVersion: string;
  nodeVersion: string;
  collectedAt: string;
}

export interface PlannedAction {
  id: string;
  title: string;
  payload: Record<string, string>;
}

export interface RepairPlan {
  summary: string;
  actions: PlannedAction[];
}

export interface ActionExecution {
  actionId: string;
  success: boolean;
  output: string;
  rollbackHint: string;
}

export interface PlatformAdapter {
  id: string;
  supportsCurrentPlatform(): boolean;
  collectDiagnostics(context: RuntimeContext): Promise<DiagnosticSnapshot>;
}

export interface DiagnosticProvider {
  collect(context: RuntimeContext, adapter: PlatformAdapter): Promise<DiagnosticSnapshot>;
}

export interface PlanGenerator {
  generatePlan(input: DiagnosticSnapshot, context: RuntimeContext): Promise<RepairPlan>;
}

export interface RepairAction {
  id: string;
  title: string;
  execute(context: RuntimeContext, payload: Record<string, string>): Promise<ActionExecution>;
}

export interface ActionExecutor {
  execute(context: RuntimeContext, plan: RepairPlan): Promise<ActionExecution[]>;
}

export interface Session {
  id: string;
  platform: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: Date;
}

export interface SessionStore {
  initialize(): Promise<void>;
  createSession(platform: string): Promise<Session>;
  appendStage(sessionId: string, stage: StageType, payload: unknown, markdownPath: string): Promise<void>;
  updateSessionStatus(sessionId: string, status: Session['status']): Promise<void>;
}

export interface MarkdownReportRenderer {
  renderStage(sessionId: string, stage: StageType, payload: unknown): Promise<string>;
}
