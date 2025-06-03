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
      },
      {
        name: 'Master Permission',
        slug: '/master-permission',
        order_number: 2,
      },
      {
        name: 'Master User',
        slug: '/master-user',
        order_number: 3,
      },
      {
        name: 'Master Menu',
        slug: '/master-menu',
        order_number: 4,
      },
    ],
  },
  {
    name: 'Master Tryout',
    slug: '/master-data',
    order_number: 3,
    childrens: [
      {
        name: 'Kategori Tryout',
        slug: '/tryout-categories',
        order_number: 1,
      },
      {
        name: 'Paket Tryout',
        slug: '/tryout-packages',
        order_number: 2,
      },
      {
        name: 'Detail Tryout',
        slug: '/tryout-details',
        order_number: 3,
      },
    ],
  },
  {
    name: 'Master Pertanyaan',
    slug: '/master-question',
    order_number: 4,
    childrens: [
      {
        name: 'Tipe Pertanyaan',
        slug: '/question-type',
        order_number: 1,
      },
      {
        name: 'Daftar Pertanyaan',
        slug: '/questions',
        order_number: 2,
      },
    ],
  },
  {
    name: 'Try Out',
    slug: '/tryout',
    order_number: 5,
    childrens: [
      {
        name: 'Daftar Paket',
        slug: '/paket-tryout',
        order_number: 1,
      },
      {
        name: 'Mulai Tryout',
        slug: '/mulai-tryout',
        order_number: 2,
      },
    ],
  },
  {
    name: 'Laporan',
    slug: '/laporan',
    order_number: 6,
    childrens: [
      {
        name: 'Hasil Try Out',
        slug: '/laporan-hasil-tryout',
        order_number: 1,
      },
      {
        name: 'Pembelian Paket Tryout',
        slug: '/laporan-pembelian-paket',
        order_number: 2,
      },
    ],
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
