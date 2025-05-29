import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionModel } from './QuestionModel';
import { TryoutPackageModel } from './TryoutPackageModel';

@Entity({ name: 'tryout_package_details' })
export class TryoutPackageDetailModel {
  @PrimaryGeneratedColumn('uuid')
  package_detail_id!: string;

  @Column({ name: 'package_id', type: 'uuid', default: null, nullable: true })
  package_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: false })
  name!: string;

  @Column({ type: 'text', name: 'description', nullable: true, default: null })
  description!: string;

  @Column({ type: 'bigint', name: 'total_questions', default: null })
  total_questions!: string;

  @Column({ type: 'jsonb', name: 'total_duration', default: { satuan: 'detik', waktu: 0 } })
  total_duration!: string;

  @Column({ type: 'bigint', name: 'order_number', default: null })
  order_number!: string;

  @Column({ type: 'bigint', name: 'passing_grade', default: null })
  passing_grade!: string;

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

  @OneToOne(() => TryoutPackageModel, (value) => value.tryout_details)
  @JoinColumn({ name: 'package_id' })
  tryout_package!: TryoutPackageModel;

  @ManyToMany(() => QuestionModel, (value) => value.tryout_details)
  @JoinTable({ name: 'tryout_question_mapping' })
  questions!: QuestionModel[];
}
