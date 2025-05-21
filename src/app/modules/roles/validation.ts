import { ILike, IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { RoleModel } from '../../../database/models/RoleModel';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { RoleService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Role Id', 'param').custom(async (value) => {
    const service = new RoleService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

export const RoleValidation = {
  created: [reqValidation(columns.role_name, 'Nama Role', 'check'), ...validationMiddleware],
  updated: [
    ...IDValidation,
    reqValidation(columns.role_name, 'Nama Role', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.Role];
      const search: string = value.trim();
      const repository = AppDataSource.getRepository(RoleModel);
      const result = await repository.findOne({
        where: [
          {
            role_name: ILike(`%${search}%`),
            deleted_at: IsNull(),
            [SC.PrimaryKey.Role]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
