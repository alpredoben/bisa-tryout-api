import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CS_DbSchema as SC } from '../../constanta';
import { TryoutDetailModal } from './TryoutDetailModal';

@Entity({ name: SC.TableName.TryoutTypes })
export class TryoutTypeModal {
  @PrimaryGeneratedColumn('uuid')
  type_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: false })
  name!: string;

  @Column({ type: 'text', name: 'description', default: null, nullable: true })
  description!: string;

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

  @OneToMany(() => TryoutDetailModal, (value) => value.type)
  tryout_details!: TryoutDetailModal[];
}
