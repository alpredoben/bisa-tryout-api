import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { TryoutPackageService } from './service';

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
    reqValidation(columns.category_id, 'Kategori ID', 'check'),
    reqValidation(columns.stage_id, 'Jenis Tes ID', 'check'),
    reqValidation(columns.total_questions, 'Jumlah Pertanyaan', 'check'),
    reqValidation(columns.order_number, 'No. Urut', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.category_id, 'Kategori ID', 'check', true),
    reqValidation(columns.stage_id, 'Jenis Tes ID', 'check', true),
    reqValidation(columns.total_questions, 'Jumlah Pertanyaan', 'check', true),
    reqValidation(columns.order_number, 'No. Urut', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
