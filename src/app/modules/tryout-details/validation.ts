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

export const TryoutDetailValidation = {
  created: [
    reqValidation(columns.package_id, 'Paket Tryout ID', 'check'),
    reqValidation(columns.type_id, 'Tipe Tryout ID', 'check'),
    reqValidation(columns.total_questions, 'Jumlah Soal', 'check'),
    reqValidation('duration', 'Durasi', 'check'),
    reqValidation('satuan', 'Durasi', 'check'),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.package_id, 'ID Paket Tryout', 'check', true),
    reqValidation(columns.type_id, 'Tipe Tryout ID', 'check', true),
    reqValidation(columns.package_id, 'ID Pake Tryout', 'check', true),
    reqValidation(columns.total_questions, 'Jumlah Soal', 'check', true),
    reqValidation('duration', 'Durasi', 'check', true),
    reqValidation('satuan', 'Durasi', 'check', true),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
