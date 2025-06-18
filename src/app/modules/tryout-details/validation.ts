import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageDetailModel } from '../../../database/models/TryoutDetailModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutDetailService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Id Detail Tryout', 'param').custom(async (value) => {
    const service = new TryoutDetailService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutPackageDetailModel);

export const TryoutDetailValidation = {
  created: [
    reqValidation(columns.name, 'Nama Detail Tryout', 'check').custom(async (value, { req }) => {
      const packageId = req?.body?.package_id;
      const result = await repository.findOne({
        where: {
          deleted_at: IsNull(),
          name: value.trim(),
          package_id: packageId,
        },
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: value }));
      }
    }),
    reqValidation(columns.package_id, 'ID Pake Tryout', 'check'),
    reqValidation(columns.total_questions, 'Jumlah Soal', 'check'),
    reqValidation('duration', 'Durasi', 'check'),
    reqValidation('satuan', 'Durasi', 'check'),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.package_id, 'ID Paket Tryout', 'check', true),
    reqValidation(columns.name, 'Nama Detail', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.TryoutPackageDetails];
      const packageId = req?.body?.package_id;
      const search: string = value.trim();
      const result = await repository.findOne({
        where: [
          {
            name: search,
            package_id: packageId,
            deleted_at: IsNull(),
            [SC.PrimaryKey.TryoutPackageDetails]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    reqValidation(columns.package_id, 'ID Pake Tryout', 'check', true),
    reqValidation(columns.total_questions, 'Jumlah Soal', 'check', true),
    reqValidation('duration', 'Durasi', 'check', true),
    reqValidation('satuan', 'Durasi', 'check', true),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
