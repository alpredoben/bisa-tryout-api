import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { TryoutPackageModal } from '../../../database/models/TryoutPackageModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutPackageService } from './service';

const repository = AppDataSource.getRepository(TryoutPackageModal);

const IDValidation = [
  reqValidation(columns.id, 'Paket Tryout ID', 'param').custom(async (value) => {
    const service = new TryoutPackageService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

export const TryoutPackageValidation = {
  created: [
    reqValidation(columns.package_name, 'Nama Paket', 'check').custom(async (value, { req }) => {
      const result = await repository.findOne({
        where: {
          deleted_at: IsNull(),
          category_id: req?.body?.category_id,
          stage_id: req?.body?.stage_id,
        },
        relations: {
          category: true,
          stage: true,
        },
      });

      if (result) {
        throw new Error(
          MessageDialog.__('error.validator.exists', {
            value: `Kategori "${result.category.name}", Jenis Tes "${result.stage.name}"`,
          }),
        );
      }
    }),
    reqValidation(columns.category_id, 'Kategori ID', 'check'),
    reqValidation(columns.stage_id, 'Jenis Tes ID', 'check'),
    reqValidation(columns.total_questions, 'Jumlah Pertanyaan', 'check', true),
    reqValidation(columns.order_number, 'No. Urut', 'check'),
    reqValidation(columns.mode_answer, 'Jenis Jawaban', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.package_name, 'Nama Paket', 'check', true).custom(async (value, { req }) => {
      const result = await repository.findOne({
        where: {
          deleted_at: IsNull(),
          category_id: req?.body?.category_id,
          stage_id: req?.body?.stage_id,
          [columns.id]: Not(req?.params?.[columns.id]),
        },
      });

      if (result && result.package_name === value) {
        throw new Error(
          MessageDialog.__('error.validator.exists', {
            value: `Paket "${result.package_name}", Kategori "${result.category.name}", Jenis Tes "${result.stage.name}"`,
          }),
        );
      }
    }),
    reqValidation(columns.category_id, 'Kategori ID', 'check', true),
    reqValidation(columns.stage_id, 'Jenis Tes ID', 'check', true),
    reqValidation(columns.total_questions, 'Jumlah Pertanyaan', 'check', true),
    reqValidation(columns.order_number, 'No. Urut', 'check', true),
    reqValidation(columns.mode_answer, 'Jenis Jawaban', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
