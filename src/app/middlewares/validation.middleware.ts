import { NextFunction, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';
import { I_ExpressResponse } from '../../interfaces/app.interface';
import { MessageDialog } from '../../lang';
import { sendResponseJson } from '../../utils/response.util';

export const errorValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const result: I_ExpressResponse = {
      success: false,
      code: 422,
      message: 'Validation error',
      data: errors.array().map((err: any) => ({
        field: err.param,
        message: err.msg,
      })),
    };
    return sendResponseJson(res, result);
  }
  return next();
};

export const validationMiddleware = [
  (req: Request, res: Response, next: NextFunction) => {
    errorValidationMiddleware(req, res, next);
  },
];

export const reqValidation = (property: string, required: string, type: string = 'body', optional: boolean = false) => {
  const validation = type === 'body' ? body(property) : check(property);
  if (optional === true) {
    return validation.optional(optional);
  }

  return validation.notEmpty().withMessage(MessageDialog.__('validator.required', { field: `${required}` }));
};
