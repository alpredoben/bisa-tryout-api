import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { OrganizationModal } from '../../../database/models/OrganizationModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutTypeService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Jenis Tes Id', 'param').custom(async (value) => {
    const service = new TryoutTypeService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(OrganizationModal);

export const TryoutTypeValidation = {
  created: [
    reqValidation(columns.name, 'Nama Jenis', 'check').custom(async (value) => {
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
    reqValidation(columns.description, 'Keterangan', 'check', true),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.name, 'Nama Jenis', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[columns.id];
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
    reqValidation(columns.description, 'Keterangan', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
