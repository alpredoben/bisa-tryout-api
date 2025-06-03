import { In, IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { AccessPermissionModel } from '../models/AccessPermissionModel';
import { MenuModel } from '../models/MenuModel';
import { PermissionModel } from '../models/PermissionModel';
import { RoleMenuModel } from '../models/RoleMenuModel';
import { RoleModel } from '../models/RoleModel';
import { UserModel } from '../models/UserModel';

const data = [
  {
    role_name: 'Superadmin',
    menu: [
      {
        name: 'Dashboard',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Konfigurasi',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Master Role',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Master Permission',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Master User',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Master Menu',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Master Tryout',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Kategori Tryout',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Paket Tryout',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Detail Tryout',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },

      {
        name: 'Master Pertanyaan',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },

      {
        name: 'Tipe Pertanyaan',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
      {
        name: 'Daftar Pertanyaan',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },

      {
        name: 'Laporan',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },

      {
        name: 'Hasil Try Out',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },

      {
        name: 'Pembelian Paket Tryout',
        permissions: ['read', 'create', 'update', 'delete', 'import', 'export', 'print', 'report'],
      },
    ],
  },
];

const repoRole = AppDataSource.getRepository(RoleModel);
const repoMenu = AppDataSource.getRepository(MenuModel);
const repoPermission = AppDataSource.getRepository(PermissionModel);

const repoRoleMenu = AppDataSource.getRepository(RoleMenuModel);
const repoAccessPermission = AppDataSource.getRepository(AccessPermissionModel);

export const RoleMenuPermissionSeeder = async () => {
  const repoUser = AppDataSource.getRepository(UserModel);
  let userId: any = null;
  const rowUser = await repoUser.findOne({
    where: {
      deleted_at: IsNull(),
      role: {
        role_slug: 'superadmin',
      },
    },
  });

  if (rowUser) {
    userId = rowUser.user_id;

    if (data.length > 0) {
      const queryRunner = AppDataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      let listError: any[] = [];
      try {
        for (let i = 0; i < data.length; i++) {
          const element = data[i];

          const findRole = await repoRole.findOne({
            where: {
              deleted_at: IsNull(),
              role_name: element.role_name,
            },
          });

          if (!findRole) {
            listError.push(element);
            continue;
          }

          if (element?.menu?.length > 0) {
            let failed = 0;
            for (let j = 0; j < element?.menu.length; j++) {
              const menu = element?.menu[j];

              const findMenu = await repoMenu.findOne({
                where: {
                  deleted_at: IsNull(),
                  name: menu.name,
                },
              });

              if (!findMenu) {
                failed += 1;
                continue;
              }

              const insertRoleMenu = await repoRoleMenu.save(
                repoRoleMenu.create({
                  role_id: findRole.role_id,
                  menu_id: findMenu.menu_id,
                  created_at: new Date(standartDateISO()),
                  created_by: userId,
                }),
              );

              if (!insertRoleMenu) {
                failed += 1;
                continue;
              }

              const rowPermission = await repoPermission.find({
                where: {
                  deleted_at: IsNull(),
                  name: In(menu.permissions),
                },
                select: {
                  permission_id: true,
                },
              });

              if (!rowPermission) {
                failed += 1;
                continue;
              }

              const listAccessPermission = rowPermission.map((x) => ({
                item_id: insertRoleMenu.item_id,
                permission_id: x.permission_id,
                created_at: new Date(standartDateISO()),
                created_by: userId,
              }));

              await repoAccessPermission.insert(listAccessPermission);
            }

            if (failed > 0) {
              listError.push(element);
            }
          }
        }

        if (listError.length > 0) {
          await queryRunner.rollbackTransaction();
        } else {
          await queryRunner.commitTransaction();
        }
      } catch (error: any) {
        await queryRunner.rollbackTransaction();
      } finally {
        await queryRunner.release();
      }
    }
  }
};
