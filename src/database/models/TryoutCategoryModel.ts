import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TryoutPackageModel } from './TryoutPackageModel';

@Entity({ name: 'tryout_categories' })
export class TryoutCategoryModel {
  @PrimaryGeneratedColumn('uuid')
  category_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'name' })
  name!: string;

  @Column({ type: 'text', default: null, name: 'description' })
  description!: string;

  @Column({ type: 'text', default: null, name: 'icon' })
  icon!: string;

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

  @OneToOne(() => TryoutPackageModel, (value) => value.tryout_category)
  tryout_package!: TryoutPackageModel;
}
