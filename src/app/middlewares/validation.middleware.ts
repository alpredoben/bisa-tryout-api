import { NextFunction, Request, Response } from 'express';
import { validate, ValidationError } from 'express-validation';
import { ObjectSchema } from 'joi';
import { sendErrorResponse } from '../../utils/response.util';

interface I_ValidationSchema {
  body?: ObjectSchema<any>;
  query?: ObjectSchema<any>;
  params?: ObjectSchema<any>;
}

export function validateRequest(schema: I_ValidationSchema, customMessage?: string) {
  const validationMiddleware = validate(schema, { context: true }, { abortEarly: false });

  return (req: Request, res: Response, next: NextFunction) => {
    validationMiddleware(req as any, res as any, (err: unknown) => {
      if (err) {
        if (err instanceof ValidationError) {
          return sendErrorResponse(res, 400, customMessage || 'Validation Failed', err.details);
        }
        return next(err);
      }
      next();
    });
  };
}
