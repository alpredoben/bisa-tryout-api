import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'history_import_transaction' })
export class HistoryImportTransaction {
  @PrimaryGeneratedColumn('uuid')
  history_id!: string;

  @Column({ type: 'timestamp', name: 'execute_time', nullable: true, default: null })
  execute_time!: Date;

  @Column({ type: 'text', name: 'description', nullable: true, default: null })
  description!: string;

  @Column({ type: 'varchar', name: 'execute_status', default: 'on-process' })
  execute_status!: string;

  @Column({ type: 'text', name: 'file_name', default: null, nullable: true })
  file_name!: string;

  @Column({ type: 'jsonb', name: 'execute_report', nullable: true, default: null })
  execute_report!: any;

  @Column({ type: 'text', name: 'path_file', nullable: true, default: null })
  path_file!: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true, name: 'updated_at' })
  updated_at!: Date;
}
