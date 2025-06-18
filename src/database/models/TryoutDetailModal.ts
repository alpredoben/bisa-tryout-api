import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CS_DbSchema as SC } from '../../constanta';
import { TryoutPackageModal } from './TryoutPackageModal';
import { TryoutTypeModal } from './TryoutTypeModal';

@Entity({ name: SC.TableName.TryoutDetails })
export class TryoutDetailModal {
  @PrimaryGeneratedColumn('uuid')
  detail_id!: string;

  @Column({ name: 'package_id', type: 'uuid', default: null, nullable: true })
  package_id!: string;

  @Column({ name: 'type_id', type: 'uuid', default: null, nullable: true })
  type_id!: string;

  @Column({ type: 'bigint', name: 'total_questions', default: null })
  total_questions!: number;

  @Column({ type: 'jsonb', name: 'total_duration', default: { satuan: 'detik', waktu: 0 } })
  total_duration!: string;

  @Column({ type: 'bigint', name: 'order_number', default: null })
  order_number!: number;

  @Column({ type: 'bigint', name: 'passing_grade', default: null })
  passing_grade!: number;

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

  @ManyToOne(() => TryoutPackageModal, (value) => value.tryout_details)
  @JoinColumn({ name: 'package_id' })
  package!: TryoutPackageModal;

  @ManyToOne(() => TryoutTypeModal, (value) => value.tryout_details)
  @JoinColumn({ name: 'type_id' })
  type!: TryoutTypeModal;
}
