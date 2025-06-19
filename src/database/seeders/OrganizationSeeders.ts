import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { standartDateISO } from '../../utils/common.util';
import { OrganizationModal } from '../models/OrganizationModal';
import { UserModel } from '../models/UserModel';

const repository = AppDataSource.getRepository(OrganizationModal);

const data = [
  { name: 'BUMN' },
  { name: 'ASN' },
  { name: 'PTN' },
  { name: 'SEKDIN' },
  { name: 'Swasta' },
  { name: 'Lainnya' },
];

export const OrganizationSeeder = async () => {
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

  if (rowUser && data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      const result = await repository.findOne({
        where: {
          name: element.name,
          deleted_at: IsNull(),
        },
      });

      if (!result) {
        await repository.save(
          repository.create({
            ...element,
            created_at: new Date(standartDateISO()),
            created_by: userId,
            updated_at: new Date(standartDateISO()),
            updated_by: userId,
          }),
        );
      }
    }
  }
};
