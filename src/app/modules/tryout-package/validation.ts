import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageModel } from '../../../database/models/TryoutPackageModel';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutPackageService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Id Paket Tryout', 'param').custom(async (value) => {
    const service = new TryoutPackageService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutPackageModel);

export const TryoutPackageValidation = {
  created: [
    reqValidation(columns.name, 'Nama Paket', 'check').custom(async (value) => {
      const result = await repository.findOne({
        where: {
          deleted_at: IsNull(),
          name: value.trim(),
        },
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: value }));
      }
    }),
    reqValidation(columns.prices, 'Harga', 'check'),
    reqValidation(columns.category_id, 'ID Kategori Tryout', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.prices, 'Harga Paket', 'check', true),
    reqValidation(columns.category_id, 'ID Kategori Tryout', 'check', true),
    reqValidation(columns.name, 'Nama Paket', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.TryoutPackages];
      const categoryId = req?.body?.category_id;
      const search: string = value.trim();
      const result = await repository.findOne({
        where: [
          {
            name: search,
            category_id: categoryId,
            deleted_at: IsNull(),
            [SC.PrimaryKey.TryoutPackages]: Not(id),
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
