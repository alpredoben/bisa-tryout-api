import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutCategoryModel } from '../../../database/models/TryoutCategoryModel';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutCategoryService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Id Kategori Tryout', 'param').custom(async (value) => {
    const service = new TryoutCategoryService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutCategoryModel);

export const TryoutCategoryValidation = {
  created: [
    reqValidation(columns.name, 'Nama Kategori', 'check').custom(async (value) => {
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
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.name, 'Nama Kategori', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.TryoutCategories];
      const search: string = value.trim();
      const result = await repository.findOne({
        where: [
          {
            name: search,
            deleted_at: IsNull(),
            [SC.PrimaryKey.TryoutCategories]: Not(id),
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
