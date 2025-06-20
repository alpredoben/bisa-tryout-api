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
import { CS_DbSchema as SC } from '../../constanta';
import { OrganizationModal } from './OrganizationModal';
import { TryoutPackageModal } from './TryoutPackageModal';

@Entity({ name: SC.TableName.TryoutCategories })
export class TryoutCategoryModal {
  @PrimaryGeneratedColumn('uuid')
  category_id!: string;

  @Column({ name: 'organization_id', type: 'uuid', default: null, nullable: true })
  organization_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false, name: 'name' })
  name!: string;

  @Column({ type: 'text', default: null, name: 'description' })
  description!: string;

  @Column({ type: 'bigint', name: 'year', default: null })
  year!: number;

  @Column({ type: 'decimal', name: 'prices', default: null })
  prices!: number;

  @Column({ type: 'jsonb', nullable: true, default: null, name: 'icon' })
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

  @OneToOne(() => OrganizationModal, (value) => value.tryout_categories)
  @JoinColumn({ name: 'organization_id' })
  organization!: OrganizationModal;

  @OneToMany(() => TryoutPackageModal, (value) => value.category)
  tryout_packages!: TryoutPackageModal[];
}
