import { IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageModel } from '../../../database/models/TryoutTypeModal';
import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';
import { columns } from './constanta';
import { QuestionTypeService } from './service';

const IDValidation = [
  reqValidation(columns.id, 'Id Tipe Pertanyaan', 'param').custom(async (value) => {
    const service = new QuestionTypeService();
    const result = await service.findById(value);

    if (!result.success) {
      throw new Error(result.message);
    }
  }),
];

const repository = AppDataSource.getRepository(TryoutPackageModel);

export const QusetionTypeValidation = {
  created: [
    reqValidation(columns.name, 'Nama Tipe', 'check').custom(async (value) => {
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
    reqValidation(columns.description, 'Deskripsi', 'check', true),
    ...validationMiddleware,
  ],
  updated: [
    ...IDValidation,
    reqValidation(columns.name, 'Nama Tipe', 'check', true).custom(async (value, { req }) => {
      const id = req?.params?.[SC.PrimaryKey.QuestionTypes];
      const search: string = value.trim();
      const result = await repository.findOne({
        where: [
          {
            name: search,
            deleted_at: IsNull(),
            [SC.PrimaryKey.QuestionTypes]: Not(id),
          },
        ],
      });

      if (result) {
        throw new Error(MessageDialog.__('error.validator.exists', { value: search }));
      }
    }),
    reqValidation(columns.description, 'Deskripsi', 'check', true),
    ...validationMiddleware,
  ],
  findId: [...IDValidation, ...validationMiddleware],
};
