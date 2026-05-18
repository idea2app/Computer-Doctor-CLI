import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { type StageType } from '../../core/contracts.js';

export abstract class Base {
  @PrimaryColumn('text')
  id!: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt!: Date;
}

@Entity()
export class Session extends Base {
  @Column('text')
  platform!: string;

  @Column('text')
  status!: 'running' | 'completed' | 'failed';
}

@Entity()
export class StageRecord extends Base {
  @Column('text')
  sessionId!: string;

  @Column('text')
  stage!: StageType;

  @Column('simple-json')
  payload!: object;

  @Column('text')
  markdownPath!: string;
}
