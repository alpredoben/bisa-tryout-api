import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { encryptPassword } from '../../utils/bcrypt.util';
import { standartDateISO } from '../../utils/common.util';
import { RoleModel } from '../models/RoleModel';
import { UserModel } from '../models/UserModel';

const repository = AppDataSource.getRepository(UserModel);
const roleRepo = AppDataSource.getRepository(RoleModel);

const data = [
  {
    name: 'Ruben Alpredo Tampubolon',
    email: 'alpredo.tampubolon@gmail.com',
    password: 'queen123',
    phone: '081362871802',
    role: 'developer',
  },
  {
    name: 'Superadmin',
    email: 'superadmin@gmail.com',
    password: 'password123',
    phone: '6729912834',
    role: 'superadmin',
  },
  {
    name: 'Dummy Account',
    email: 'dummy@gmail.com',
    password: 'password123',
    phone: '6729912834',
    role: 'member',
  },
];

export const UserSeeders = async () => {
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      const { role, ...rest } = data[i];

      const rowRole = await roleRepo.findOne({
        where: {
          role_slug: role,
        },
      });

      if (rowRole) {
        const result = await repository.findOne({
          where: {
            email: rest.email,
            deleted_at: IsNull(),
          },
        });

        if (!result) {
          rest.password = (await encryptPassword(rest.password)).password_hash;

          await repository.save(
            repository.create({
              ...rest,
              verified_at: new Date(standartDateISO()),
              has_verified: true,
              role_id: rowRole.role_id,
              created_at: new Date(standartDateISO()),
            }),
          );
        }
      }
    }
  }
};
