import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TryoutCategoryModel } from './TryoutCategoryModel';
import { TryoutPackageDetailModel } from './TryoutPackageDetailModel';

@Entity({ name: 'tryout_packages' })
export class TryoutPackageModel {
  @PrimaryGeneratedColumn('uuid')
  package_id!: string;

  @Column({ name: 'category_id', type: 'uuid', default: null, nullable: true })
  category_id!: string;

  @Column({ type: 'varchar', length: 255, name: 'name', nullable: false })
  name!: string;

  @Column({ type: 'text', name: 'description', nullable: true, default: null })
  description!: string;

  @Column({ type: 'decimal', name: 'prices', default: null })
  prices!: string;

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

  @OneToOne(() => TryoutCategoryModel, (value) => value.tryout_package)
  @JoinColumn({ name: 'category_id' })
  tryout_category!: TryoutCategoryModel;

  @OneToMany(() => TryoutPackageDetailModel, (value) => value.tryout_package)
  tryout_details!: TryoutPackageDetailModel[];
}
