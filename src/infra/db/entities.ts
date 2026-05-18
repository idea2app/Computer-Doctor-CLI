import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';
import { type StageType } from '../../core/contracts.js';

@Entity('sessions')
export class SessionEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  platform!: string;

  @Column('text')
  status!: 'running' | 'completed' | 'failed';

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}

@Entity('stage_records')
export class StageRecordEntity {
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  sessionId!: string;

  @Column('text')
  stage!: StageType;

  @Column('text')
  payloadJson!: string;

  @Column('text')
  markdownPath!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;
}
