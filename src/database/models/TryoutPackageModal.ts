import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CS_DbSchema as SC } from '../../constanta';
import { TryoutCategoryModal } from './TryoutCategoryModal';
import { TryoutDetailModal } from './TryoutDetailModal';
import { TryoutStageModal } from './TryoutStageModal';

@Entity({ name: SC.TableName.TryoutPackages })
export class TryoutPackageModal {
  @PrimaryGeneratedColumn('uuid')
  package_id!: string;

  @Column({ name: 'category_id', type: 'uuid', default: null, nullable: true })
  category_id!: string;

  @Column({ name: 'stage_id', type: 'uuid', default: null, nullable: true })
  stage_id!: string;

  @Column({ type: 'bigint', name: 'total_questions', default: null })
  total_questions!: number;

  @Column({ type: 'bigint', name: 'order_number', default: null })
  order_number!: number;

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

  @ManyToOne(() => TryoutCategoryModal, (value) => value.tryout_packages)
  @JoinColumn({ name: 'category_id' })
  category!: TryoutCategoryModal;

  @ManyToOne(() => TryoutStageModal, (value) => value.tryout_packages)
  @JoinColumn({ name: 'stage_id' })
  stage!: TryoutStageModal;

  @OneToMany(() => TryoutDetailModal, (value) => value.package)
  tryout_details!: TryoutDetailModal[];
}
