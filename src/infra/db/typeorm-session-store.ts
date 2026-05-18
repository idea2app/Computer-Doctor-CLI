import { randomUUID } from 'node:crypto';
import { DataSource } from 'typeorm';
import { type Session, type SessionStore, type StageType } from '../../core/contracts.js';
import { SessionEntity, StageRecordEntity } from './entities.js';

export class TypeormSessionStore implements SessionStore {
  constructor(private readonly dataSource: DataSource) {}

  async initialize(): Promise<void> {
    if (!this.dataSource.isInitialized) {
      await this.dataSource.initialize();
    }
  }

  async createSession(platform: string): Promise<Session> {
    const entity = this.dataSource.getRepository(SessionEntity).create({
      id: randomUUID(),
      platform,
      status: 'running'
    });

    const saved = await this.dataSource.getRepository(SessionEntity).save(entity);

    return {
      id: saved.id,
      platform: saved.platform,
      status: saved.status,
      createdAt: saved.createdAt
    };
  }

  async appendStage(sessionId: string, stage: StageType, payload: unknown, markdownPath: string): Promise<void> {
    const entity = this.dataSource.getRepository(StageRecordEntity).create({
      id: randomUUID(),
      sessionId,
      stage,
      payloadJson: JSON.stringify(payload, null, 2),
      markdownPath
    });

    await this.dataSource.getRepository(StageRecordEntity).save(entity);
  }

  async updateSessionStatus(sessionId: string, status: Session['status']): Promise<void> {
    await this.dataSource.getRepository(SessionEntity).update({ id: sessionId }, { status });
  }
}
