import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CS_DbSchema as SC } from '../../constanta';
import { AnswerModal } from './AnswerModal';
import { DiscussionModal } from './DiscussionModal';
import { TryoutCategoryModal } from './TryoutCategoryModal';

@Entity({ name: SC.TableName.Questions })
export class QuestionModal {
  @PrimaryGeneratedColumn('uuid')
  question_id!: string;

  @Column({ name: 'detail_id', type: 'uuid', default: null, nullable: true })
  detail_id!: string;

  @Column({ type: 'varchar', length: 200, name: 'question_type', nullable: true, default: 'text' })
  question_type!: string;

  @Column({ type: 'text', name: 'question_value', nullable: true, default: null })
  question_value!: string;

  @Column({ type: 'jsonb', name: 'question_file', default: null, nullable: true })
  question_file!: string;

  @Column({ type: 'boolean', name: 'question_status', default: true })
  question_status!: string;
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

  @OneToMany(() => TryoutCategoryModal, (value) => value.organization)
  tryout_categories!: TryoutCategoryModal[];

  @OneToMany(() => AnswerModal, (value) => value.question)
  answers!: AnswerModal[];

  @OneToOne(() => DiscussionModal, (value) => value.question)
  discussion!: DiscussionModal;
}
