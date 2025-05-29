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
import { QuestionModel } from './QuestionModel';
import { TryoutPackageDetailModel } from './TryoutPackageDetailModel';

@Entity({ name: 'tryout_question_mapping' })
export class TryoutQuestionMapping {
  @PrimaryGeneratedColumn('uuid')
  tryout_question_id!: string;

  @Column({ name: 'package_detail_id', type: 'uuid', default: null, nullable: true })
  package_detail_id!: string;

  @Column({ name: 'question_id', type: 'uuid', default: null, nullable: true })
  question_id!: string;

  @Column({ type: 'bigint', name: 'order_number', default: null })
  order_number!: string;

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

  @ManyToOne(() => TryoutPackageDetailModel, (value) => value.questions)
  @JoinColumn({ name: 'package_detail_id' })
  tryout_detail!: TryoutPackageDetailModel;

  @ManyToOne(() => QuestionModel, (value) => value.tryout_details)
  @JoinColumn({ name: 'question_id' })
  question!: QuestionModel;
}
