import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { UserModel } from '../../../database/models/UserModel';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { UserService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'User Id', 'param').custom(async (value) => {
    const service = new UserService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

export const UserValidation = {
  created: [
    reqValidation(columns.role_id, 'Role Id', 'check'),
    reqValidation('file_id', 'File Id', 'check', true),
    reqValidation(columns.name, 'Nama Lengkap', 'check'),
    reqValidation(columns.email, 'Email', 'check')
      .isEmail()
      .normalizeEmail()
      .withMessage(MessageDialog.__('error.validator.email')),
    reqValidation(columns.password, 'Password', 'check')
      .isLength({ min: 6 })
      .withMessage(MessageDialog.__('error.validator.min', { value: '6' })),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.role_id, 'Role Id', 'check', true),
    reqValidation(columns.name, 'Nama Lengkap', 'check', true),
    reqValidation(columns.email, 'Email', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.Role];
      const repository = AppDataSource.getRepository(UserModel);
      const result = await repository.findOne({
        where: [
          {
            email: value,
            deleted_at: IsNull(),
            [SC.PrimaryKey.User]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value }));
      }
    }),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
