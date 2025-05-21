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
import { RoleMenuSelectionModel } from './RoleMenuSelectionModel';

@Entity({ name: 'role_menu_permissions' })
export class RoleMenuPermissionsModel {
  @PrimaryGeneratedColumn('uuid')
  permission_id!: string;

  @Column({ name: 'selection_id', type: 'uuid', default: null, nullable: true })
  selection_id!: string;

  @OneToOne(() => RoleMenuSelectionModel, (value) => value.role_menu_permission)
  @JoinColumn({ name: 'selection_id' })
  menu_selection!: RoleMenuSelectionModel;

  @Column({ type: 'text', default: null, nullable: true })
  access_name!: string;

  @Column({ type: 'boolean', default: false })
  access_status!: boolean;

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
}
