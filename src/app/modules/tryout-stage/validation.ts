import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { TryoutStageModal } from '../../../database/models/TryoutStageModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutStageService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Tahapan Tryout Id', 'param').custom(async (value) => {
    const service = new TryoutStageService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutStageModal);

export const TryoutStageValidation = {
  created: [
    reqValidation(columns.name, 'Nama Tahapan', 'check').custom(async (value) => {
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
    reqValidation(columns.name, 'Nama Tahapan', 'check', true).custom(async (value, { req }) => {
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
