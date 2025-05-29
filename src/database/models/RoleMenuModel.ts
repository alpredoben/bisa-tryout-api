import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccessPermissionModel } from './AccessPermissionModel';
import { MenuModel } from './MenuModel';
import { RoleModel } from './RoleModel';

@Entity({ name: 'role_had_menus' })
export class RoleMenuModel {
  @PrimaryGeneratedColumn('uuid')
  item_id!: string;

  @Column({ name: 'role_id', type: 'uuid', default: null, nullable: true })
  role_id!: string;

  @Column({ name: 'menu_id', type: 'uuid', default: null, nullable: true })
  menu_id!: string;

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

  @ManyToOne(() => RoleModel, (value) => value.role_menu_access)
  @JoinColumn({ name: 'role_id' })
  role!: RoleModel;

  @ManyToOne(() => MenuModel, (value) => value.role_menu_access)
  @JoinColumn({ name: 'menu_id' })
  menu!: MenuModel;

  @OneToMany(() => AccessPermissionModel, (value) => value.role_menu_access)
  access_permissions!: AccessPermissionModel[];
}
