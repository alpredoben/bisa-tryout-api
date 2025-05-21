import { MessageDialog } from '../../../lang';
import { reqValidation, validationMiddleware } from '../../middlewares/validation.middleware';

export const AuthValidation = {
  login: [
    reqValidation('email', 'Email', 'check')
      .isEmail()
      .normalizeEmail()
      .withMessage(MessageDialog.__('error.validator.email')),

    reqValidation('password', 'Password', 'check')
      .isLength({ min: 6 })
      .withMessage(MessageDialog.__('error.validator.min', { value: '6' })),
    ...validationMiddleware,
  ],

  register: [
    reqValidation('phone', 'No. Telepon/WA', 'check'),
    reqValidation('nama', 'Nama Lengkap', 'check'),
    reqValidation('email', 'Email', 'check')
      .isEmail()
      .normalizeEmail()
      .withMessage(MessageDialog.__('error.validator.email')),
    reqValidation('password', 'Password', 'check')
      .isLength({ min: 6 })
      .withMessage(MessageDialog.__('error.validator.min', { value: '6' })),
    reqValidation('confirm_password', 'Konfirmasi Password', 'check')
      .isLength({ min: 6 })
      .withMessage(MessageDialog.__('error.validator.min', { value: '6' }))
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error(MessageDialog.__('error.validator.matchPassword'));
        }
        return true;
      }),
    ...validationMiddleware,
  ],
};
