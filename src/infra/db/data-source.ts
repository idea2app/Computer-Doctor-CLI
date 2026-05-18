import path from 'node:path';
import { DataSource } from 'typeorm';
import { SessionEntity, StageRecordEntity } from './entities.js';

export function createAppDataSource(workspaceDir: string): DataSource {
  return new DataSource({
    type: 'sqlite',
    database: path.join(workspaceDir, 'computer-doctor.sqlite'),
    entities: [SessionEntity, StageRecordEntity],
    synchronize: true
  });
}
