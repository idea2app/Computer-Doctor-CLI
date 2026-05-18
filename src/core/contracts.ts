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

export interface SessionData {
  id: string;
  platform: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: Date;
}

export abstract class PlatformAdapter {
  abstract id: string;
  abstract supportsCurrentPlatform(): boolean;
  abstract collectDiagnostics(context: RuntimeContext): Promise<DiagnosticSnapshot>;
}

export abstract class DiagnosticProvider {
  abstract collect(context: RuntimeContext, adapter: PlatformAdapter): Promise<DiagnosticSnapshot>;
}

export abstract class PlanGenerator {
  abstract generatePlan(input: DiagnosticSnapshot, context: RuntimeContext): Promise<RepairPlan>;
}

export abstract class RepairAction {
  abstract id: string;
  abstract title: string;
  abstract execute(context: RuntimeContext, payload: Record<string, string>): Promise<ActionExecution>;
}

export abstract class ActionExecutor {
  abstract execute(context: RuntimeContext, plan: RepairPlan): Promise<ActionExecution[]>;
}

export abstract class SessionStore {
  abstract initialize(): Promise<void>;
  abstract createSession(platform: string): Promise<SessionData>;
  abstract appendStage(sessionId: string, stage: StageType, payload: unknown, markdownPath: string): Promise<unknown>;
  abstract updateSessionStatus(sessionId: string, status: SessionData['status']): Promise<unknown>;
}

export abstract class MarkdownReportRenderer {
  abstract renderStage(sessionId: string, stage: StageType, payload: unknown): Promise<string>;
}
