import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MenuModel } from './MenuModel';
import { RoleMenuPermissionsModel } from './RoleMenuPermissionsModel';
import { RoleModel } from './RoleModel';

@Entity({ name: 'role_menu_selection' })
export class RoleMenuSelectionModel {
  @PrimaryGeneratedColumn('uuid')
  selection_id!: string;

  @ManyToOne(() => RoleModel, (value) => value.role_menu_selection)
  @JoinColumn({ name: 'role_id' })
  role!: RoleModel;

  @ManyToOne(() => MenuModel, (value) => value.role_menu_selection)
  @JoinColumn({ name: 'menu_id' })
  master_module!: MenuModel;

  @OneToOne(() => RoleMenuPermissionsModel, (value) => value.menu_selection)
  role_menu_permission!: RoleMenuPermissionsModel;

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
