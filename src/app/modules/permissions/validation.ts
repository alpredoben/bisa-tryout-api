import { ILike, IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { PermissionModel } from '../../../database/models/PermissionModel';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { PermissionService } from './service';

const repository = AppDataSource.getRepository(PermissionModel);

const IDValidation = [
  reqValidation(columns.id, 'ID Permission', 'param').custom(async (value) => {
    const service = new PermissionService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

export const PermissionValidation = {
  created: [
    reqValidation(columns.name, 'Nama Permission', 'check').custom(async (value) => {
      const search: string = value.trim();
      const result = await repository.findOne({
        where: {
          deleted_at: IsNull(),
          name: search,
        },
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    reqValidation(columns.order_number, 'Order Number Permission', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.name, 'Nama Permission', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.Permission];
      const search: string = value.trim();
      const result = await repository.findOne({
        where: [
          {
            name: ILike(`%${search}%`),
            deleted_at: IsNull(),
            [SC.PrimaryKey.Permission]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    reqValidation(columns.order_number, 'Action Permission', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
