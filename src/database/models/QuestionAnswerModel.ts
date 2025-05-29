import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionModel } from './QuestionModel';

@Entity({ name: 'question_answers' })
export class QuestionAnswerModel {
  @PrimaryGeneratedColumn('uuid')
  answer_id!: string;

  @Column({ name: 'question_id', type: 'uuid', default: null, nullable: true })
  question_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'type_answer', default: 'text' })
  type_answer!: string;

  @Column({ type: 'text', name: 'answer_value', nullable: true, default: null })
  answer_value!: string;

  @Column({ type: 'boolean', name: 'is_answer', default: false })
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

  @OneToOne(() => QuestionModel, (value) => value.answers)
  @JoinColumn({ name: 'question_id' })
  question!: QuestionModel;
}
