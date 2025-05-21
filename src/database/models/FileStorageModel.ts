import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'file_storages' })
export class FileStorageModel {
  @PrimaryGeneratedColumn('uuid')
  file_id!: string;

  @Column({ type: 'text', name: 'file_name', nullable: true, default: null })
  file_name!: string;

  @Column({ type: 'text', name: 'file_desc', nullable: true, default: null })
  file_desc!: string;

  @Column({ type: 'text', name: 'file_url', nullable: true, default: null })
  file_url!: string;

  @Column({ type: 'bool', name: 'has_used', nullable: true, default: false })
  has_used!: Boolean;

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
