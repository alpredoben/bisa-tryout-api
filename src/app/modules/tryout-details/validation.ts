import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutDetailService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Detail Tryout ID', 'param').custom(async (value) => {
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
    reqValidation(columns.total_duration, 'Waktu Durasi', 'check', true),
    reqValidation(columns.satuan_duration, 'Satuan Durasi', 'check', true),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check'),
    reqValidation(columns.order_number, 'Nilai Passing Grade', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.package_id, 'Paket Tryout ID', 'check', true),
    reqValidation(columns.type_id, 'Tipe Tryout ID', 'check', true),
    reqValidation(columns.total_questions, 'Jumlah Soal', 'check', true),
    reqValidation(columns.total_duration, 'Waktu Durasi', 'check', true),
    reqValidation(columns.satuan_duration, 'Satuan Durasi', 'check', true),
    reqValidation(columns.passing_grade, 'Nilai Passing Grade', 'check', true),
    reqValidation(columns.order_number, 'Nomor Urut', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
