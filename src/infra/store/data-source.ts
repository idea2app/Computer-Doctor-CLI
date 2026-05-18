import { join } from 'node:path';

import { DataSource } from 'typeorm';

import { Session, StageRecord } from './entities.js';

export const createAppDataSource = (workspaceDir: string) =>
  new DataSource({
    type: 'better-sqlite3',
    database: join(workspaceDir, 'computer-doctor.sqlite'),
    entities: [Session, StageRecord],
    synchronize: true
  });
