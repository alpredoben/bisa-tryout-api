import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { MenuService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Menu Id', 'param').custom(async (value) => {
    const service = new MenuService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

export const MenuValidation = {
  created: [
    reqValidation(columns.parent_id, 'Parent Id', 'check', true),
    reqValidation('file_id', 'File Id', 'check', true),
    reqValidation(columns.name, 'Nama Menu', 'check'),
    reqValidation(columns.slug, 'Slug', 'check'),
    reqValidation(columns.order_number, 'No. Urut', 'check'),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.parent_id, 'Parent Id', 'check', true),
    reqValidation(columns.name, 'Nama Lengkap', 'check', true),
    reqValidation(columns.slug, 'Slug', 'check', true),
    reqValidation(columns.order_number, 'No. Urut', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
