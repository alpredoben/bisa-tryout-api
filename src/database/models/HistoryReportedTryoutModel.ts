import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'history_reported_tryout' })
export class HistoryReportedTryoutModel {
  @PrimaryGeneratedColumn('uuid')
  history_id!: string;

  @Column({ type: 'varchar', length: 50, name: 'history_status', default: null })
  history_status!: string;

  @Column({ type: 'varchar', length: 100, name: 'history_type', default: null })
  history_type!: string;

  @Column({ type: 'jsonb', name: 'history_request', default: null })
  history_request!: string;

  @Column({ type: 'jsonb', name: 'history_response', default: null })
  history_response!: string;

  @Column({ type: 'text', name: 'history_description', default: null })
  history_description!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at!: Date;

  @Column({ name: 'created_by', type: 'uuid', select: false })
  created_by!: string;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updated_at!: Date;

  @Column({ name: 'updated_by', type: 'uuid', select: false })
  updated_by!: string;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, name: 'deleted_at', select: false })
  deleted_at!: Date;

  @Column({ name: 'deleted_by', type: 'uuid', select: false })
  deleted_by!: string;
}
