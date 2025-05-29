import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessPermissionModel } from './AccessPermissionModel';

@Entity({ name: 'master_permissions' })
export class PermissionModel {
  @PrimaryGeneratedColumn('uuid')
  permission_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'bigint', default: null, nullable: true })
  order_number!: number;

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

  @OneToMany(() => AccessPermissionModel, (value) => value.permission)
  access_permissions!: AccessPermissionModel[];
}
