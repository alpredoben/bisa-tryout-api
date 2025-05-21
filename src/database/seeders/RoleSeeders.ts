import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { generateSlug, standartDateISO } from '../../utils/common.util';
import { RoleModel } from '../models/RoleModel';

const repository = AppDataSource.getRepository(RoleModel);

const data = [
  { role_name: 'Superadmin' },
  { role_name: 'Developer' },
  { role_name: 'Member' },
  { role_name: 'Operator' },
];

export const RoleSeeders = async () => {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const element = data[i];
      const slug = generateSlug(element.role_name)?.toString();

      const result = await repository.findOne({
        where: {
          role_slug: slug,
          deleted_at: IsNull(),
        },
      });

      if (!result) {
        await repository.save(
          repository.create({
            role_name: element?.role_name,
            role_slug: slug,
            created_at: new Date(standartDateISO()),
          }),
        );
      }
    }
  }
};
