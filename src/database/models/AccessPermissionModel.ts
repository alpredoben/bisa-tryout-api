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
import { PermissionModel } from './PermissionModel';
import { RoleMenuModel } from './RoleMenuModel';

@Entity({ name: 'access_permissions' })
export class AccessPermissionModel {
  @PrimaryGeneratedColumn('uuid')
  access_id!: string;

  @Column({ name: 'item_id', type: 'uuid', default: null, nullable: true })
  item_id!: string;

  @Column({ name: 'permission_id', type: 'uuid', default: null, nullable: true })
  permission_id!: string;

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

  @ManyToOne(() => RoleMenuModel, (value) => value.access_permissions)
  @JoinColumn({ name: 'item_id' })
  role_menu_access!: RoleMenuModel;

  @ManyToOne(() => PermissionModel, (value) => value.access_permissions)
  @JoinColumn({ name: 'permission_id' })
  permission!: PermissionModel;
}
