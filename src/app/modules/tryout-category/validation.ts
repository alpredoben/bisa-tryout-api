import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutCategoryModal } from '../../../database/models/TryoutCategoryModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutCategoryService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Kategori Tryout ID', 'param').custom(async (value) => {
    const service = new TryoutCategoryService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutCategoryModal);

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
    reqValidation(columns.organization_id, 'Organisasi ID', 'check'),
    reqValidation(columns.prices, 'Harga', 'check'),
    reqValidation(columns.year, 'Tahun', 'check'),
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
            [columns.id]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    reqValidation(columns.organization_id, 'Organisasi ID', 'check', true),
    reqValidation(columns.prices, 'Harga', 'check', true),
    reqValidation(columns.year, 'Tahun', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
