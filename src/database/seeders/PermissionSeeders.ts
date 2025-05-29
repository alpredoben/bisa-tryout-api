import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { PermissionModel } from '../models/PermissionModel';
import { UserModel } from '../models/UserModel';

const data = [
  {
    name: 'read',
    order_number: 1,
  },
  {
    name: 'create',
    order_number: 2,
  },
  {
    name: 'update',
    order_number: 3,
  },
  {
    name: 'delete',
    order_number: 4,
  },
  {
    name: 'import',
    order_number: 5,
  },
  {
    name: 'export',
    order_number: 6,
  },
  {
    name: 'print',
    order_number: 7,
  },
  {
    name: 'report',
    order_number: 8,
  },
];

const repository = AppDataSource.getRepository(PermissionModel);

export const PermissionSeeders = async () => {
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
      for (let i = 0; i < data.length; i++) {
        const element = data[i];

        const row = await repository.findOne({
          where: {
            deleted_at: IsNull(),
            name: element.name.trim(),
          },
        });

        if (!row) {
          await repository.save(
            repository.create({
              name: element.name,
              order_number: element.order_number,
              created_at: new Date(standartDateISO()),
              created_by: rowUser.user_id,
            }),
          );
        }
      }
    }
  }
};
