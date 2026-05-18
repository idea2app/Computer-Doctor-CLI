import { randomUUID } from 'node:crypto';

import { DataSource, Repository } from 'typeorm';

import { SessionStore, type SessionData, type StageType } from '../../core/contracts.js';
import { Session, StageRecord } from './entities.js';

export class TypeormSessionStore extends SessionStore {
  sessionStore: Repository<Session>;
  stageRecordStore: Repository<StageRecord>;

  constructor(private readonly dataSource: DataSource) {
    super();
    this.sessionStore = dataSource.getRepository(Session);
    this.stageRecordStore = dataSource.getRepository(StageRecord);
  }

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) await this.dataSource.initialize();
  }

  createSession(platform: string): Promise<SessionData> {
    return this.sessionStore.save({
      id: randomUUID(),
      platform,
      status: 'running'
    });
  }

  appendStage(sessionId: string, stage: StageType, payload: unknown, markdownPath: string) {
    return this.stageRecordStore.save({
      id: randomUUID(),
      sessionId,
      stage,
      payload: payload as object,
      markdownPath
    });
  }

  updateSessionStatus(sessionId: string, status: SessionData['status']) {
    return this.sessionStore.update({ id: sessionId }, { status });
  }
}
