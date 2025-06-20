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
import { CS_DbSchema as SC } from '../../constanta';
import { QuestionModal } from './QuestionModal';

@Entity({ name: SC.TableName.Discussion })
export class DiscussionModal {
  @PrimaryGeneratedColumn('uuid')
  discussion_id!: string;

  @Column({ name: 'question_id', type: 'uuid', default: null, nullable: true })
  question_id!: string;

  @Column({ type: 'varchar', length: 200, name: 'discussion_type', nullable: true, default: 'text' })
  discussion_type!: string;

  @Column({ type: 'text', name: 'discussion_value', nullable: true, default: null })
  discussion_value!: string;

  @Column({ type: 'jsonb', name: 'discussion_file', default: null, nullable: true })
  discussion_file!: string;

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

  @OneToOne(() => QuestionModal, (value) => value.discussion)
  @JoinColumn({ name: 'question_id' })
  question!: QuestionModal;
}
