import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionAnswerModel } from './QuestionAnswerModel';
import { QuestionTypeModel } from './QuestionTypeModel';
import { TryoutPackageDetailModel } from './TryoutPackageDetailModel';

@Entity({ name: 'questions' })
export class QuestionModel {
  @PrimaryGeneratedColumn('uuid')
  question_id!: string;

  @Column({ name: 'question_type_id', type: 'uuid', default: null, nullable: true })
  question_type_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'type_question', default: 'text' })
  type_question!: string;

  @Column({ type: 'text', name: 'question_value', nullable: true, default: null })
  question_value!: string;

  @Column({ type: 'bigint', name: 'question_point', default: null })
  question_point!: string;

  @Column({ type: 'jsonb', name: 'question_time', default: { satuan: 'detik', waktu: 0 } })
  question_time!: string;

  @Column({ type: 'boolean', name: 'question_status', default: true })
  question_status!: string;

  @Column({ type: 'varchar', length: 255, name: 'type_discussion', default: 'text' })
  type_discussion!: string;

  @Column({ type: 'text', name: 'discussion_value', nullable: true, default: null })
  discussion_value!: string;

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

  @OneToOne(() => QuestionTypeModel, (value) => value.questions)
  @JoinColumn({ name: 'question_type_id' })
  question_type!: QuestionTypeModel;

  @OneToMany(() => QuestionAnswerModel, (value) => value.question)
  answers!: QuestionAnswerModel[];

  @ManyToMany(() => TryoutPackageDetailModel, (value) => value.questions)
  @JoinTable({ name: 'tryout_question_mapping' })
  tryout_details!: TryoutPackageDetailModel[];
}
