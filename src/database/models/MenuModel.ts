import {
  AfterLoad,
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
import { RoleMenuModel } from './RoleMenuModel';

@Entity({ name: 'master_menu' })
export class MenuModel {
  @PrimaryGeneratedColumn('uuid')
  menu_id!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name!: string;

  @Column({ type: 'jsonb', default: null, nullable: false })
  icon!: string;

  @Column({ type: 'text', default: null, nullable: false })
  slug!: string;

  @Column({ type: 'bigint', default: null, nullable: false, name: 'order_number' })
  order_number!: number;

  @Column({ type: 'uuid', nullable: true }) // Ensure this matches UUID type
  parent_id?: string;

  @ManyToOne(() => MenuModel, (value) => value.childrens, {
    nullable: true,
    onDelete: 'SET NULL', // Ensure consistency with database constraint
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: MenuModel;

  @OneToMany(() => MenuModel, (value) => value.parent)
  childrens!: MenuModel[];

  @Column({ type: 'bool', name: 'is_sidebar', default: false })
  is_sidebar!: Boolean;

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

  @OneToMany(() => RoleMenuModel, (value) => value.menu)
  role_menu_access!: RoleMenuModel[];

  // virtual property
  access_permissions?: AccessPermissionModel[];

  @AfterLoad()
  populateAccessPermissions() {
    // Hanya untuk menu yang memiliki parent (bukan root)
    if (this.parent_id !== null) {
      this.access_permissions = this.role_menu_access?.flatMap((rm) =>
        (rm?.access_permissions ?? []).map((x) => ({
          access_id: x.access_id,
          item_id: x.item_id,
          permission: x.permission
            ? {
                permission_id: x.permission.permission_id,
                name: x.permission.name,
                order_number: x.permission.order_number,
              }
            : null,
        })),
      ) as unknown as AccessPermissionModel[];
    }

    // tetap rekursif ke children
    this.childrens?.forEach((child) => child.populateAccessPermissions?.());
  }
}
