import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { MenuModel } from '../models/MenuModel';
import { UserModel } from '../models/UserModel';

const data = [
  {
    name: 'Dashboard',
    slug: '/dashboard',
    order_number: 1,
    is_sidebar: true,
  },
  {
    name: 'Konfigurasi',
    slug: '/configuration',
    order_number: 2,
    childrens: [
      {
        name: 'Master Role',
        slug: '/master-role',
        order_number: 1,
        is_sidebar: true,
      },
      {
        name: 'Master Permission',
        slug: '/master-permission',
        order_number: 2,
        is_sidebar: true,
      },
      {
        name: 'Master User',
        slug: '/master-user',
        order_number: 3,
        is_sidebar: true,
      },
      {
        name: 'Master Menu',
        slug: '/master-menu',
        order_number: 4,
        is_sidebar: true,
      },
    ],
    is_sidebar: true,
  },
  {
    name: 'Master Tryout',
    slug: '/master-data',
    order_number: 3,
    is_sidebar: true,
    childrens: [
      {
        name: 'Organisasi',
        slug: '/organization',
        order_number: 1,
        is_sidebar: true,
      },
      {
        name: 'Kategori',
        slug: '/tryout-categories',
        order_number: 2,
        is_sidebar: true,
      },
      {
        name: 'Jenis Test',
        slug: '/tryout-stages',
        order_number: 3,
        is_sidebar: true,
      },
      {
        name: 'Tipe Tryout',
        slug: '/tryout-types',
        order_number: 4,
        is_sidebar: true,
      },
      {
        name: 'Paket Tryout',
        slug: '/tryout-packages',
        order_number: 5,
        is_sidebar: true,
      },
      {
        name: 'Detail Tryout',
        slug: '/tryout-details',
        order_number: 6,
        is_sidebar: true,
      },
    ],
  },
  {
    name: 'Master Pertanyaan',
    slug: '/master-question',
    order_number: 4,
    is_sidebar: true,
    childrens: [
      {
        name: 'Daftar Pertanyaan',
        slug: '/questions',
        order_number: 1,
        is_sidebar: true,
      },
    ],
  },
  {
    name: 'Try Out',
    slug: '/tryout',
    order_number: 5,
    is_sidebar: true,
    childrens: [
      {
        name: 'Daftar Paket',
        slug: '/paket-tryout',
        order_number: 1,
        is_sidebar: true,
      },
      {
        name: 'Mulai Tryout',
        slug: '/mulai-tryout',
        order_number: 2,
        is_sidebar: true,
      },
    ],
  },
  {
    name: 'Laporan',
    slug: '/laporan',
    order_number: 6,
    is_sidebar: true,
    childrens: [
      {
        name: 'Hasil Try Out',
        slug: '/laporan-hasil-tryout',
        order_number: 1,
        is_sidebar: true,
      },
      {
        name: 'Pembelian Paket Tryout',
        slug: '/laporan-pembelian-paket',
        order_number: 2,
        is_sidebar: true,
      },
    ],
  },
  {
    name: 'Pengaturan Akun',
    slug: '/akun',
    order_number: 7,
    is_sidebar: true,
    childrens: [
      {
        name: 'Profil',
        slug: '/profile',
        order_number: 1,
        is_sidebar: true,
      },
      {
        name: 'Notifikasi',
        slug: '/notification',
        order_number: 2,
        is_sidebar: true,
      },
    ],
  },
  {
    name: 'History Import Tryout',
    slug: '/history-import-tryout',
    order_number: 8,
    is_sidebar: false,
  },
];

const repository = AppDataSource.getRepository(MenuModel);

const insertMenuRecursive = async (userId: any, menu: Record<string, any>, parentId: string): Promise<void> => {
  const checkExisted = await repository.findOne({
    where: {
      deleted_at: IsNull(),
      parent_id: parentId,
      slug: menu.slug,
      name: menu.name,
    },
  });

  if (checkExisted) {
    return;
  }

  const result = await repository.save(
    repository.create({
      name: menu.name,
      slug: menu.slug,
      order_number: menu.order_number,
      parent_id: parentId,
      is_sidebar: menu.is_sidebar,
      created_at: new Date(standartDateISO()),
      created_by: userId,
    }),
  );

  if (menu?.childrens) {
    menu.childrens.forEach(async (element: any) => {
      await insertMenuRecursive(userId, element, result.menu_id);
    });
  }
};

export const MenuSeeders = async () => {
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

          const result = await repository.save(
            repository.create({
              name: element.name,
              slug: element.slug,
              order_number: element.order_number,
              is_sidebar: element.is_sidebar,
              created_at: new Date(standartDateISO()),
              created_by: userId,
            }),
          );

          if (!result) {
            listError.push(element);
            continue;
          }

          if (element?.childrens && element?.childrens?.length > 0) {
            element.childrens.forEach(async (element: any) => {
              await insertMenuRecursive(userId, element, result.menu_id);
            });
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
