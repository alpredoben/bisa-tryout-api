import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { QuestionModel } from './QuestionModel';

@Entity({ name: 'question_types' })
export class QuestionTypeModel {
  @PrimaryGeneratedColumn('uuid')
  question_type_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'name' })
  name!: string;

  @Column({ type: 'text', default: null, nullable: false, name: 'description' })
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

  @OneToMany(() => QuestionModel, (value) => value.question_type)
  questions!: QuestionModel[];
}
