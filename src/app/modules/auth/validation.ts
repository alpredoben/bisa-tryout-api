import Joi from 'joi';

export const loginValidateSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .error((errors: any) => {
        return errors.map((err: any) => {
          switch (err.code) {
            case 'string.email':
              return new Error('Email must be a valid email address');
            case 'any.required':
              return new Error('Email is required');
            default:
              return err;
          }
        });
      }),
    password: Joi.string()
      .min(8)
      .required()
      .error((errors: any) => {
        return errors.map((err: any) => {
          switch (err.code) {
            case 'string.min':
              return new Error('Password must be at least 6 characters long');
            case 'any.required':
              return new Error('Password is required');
            default:
              return err;
          }
        });
      }),
  }),
};

export const registerValidateSchema = {
  body: Joi.object({
    name: Joi.string()
      .min(3)
      .required()
      .error((errors: any) => {
        return errors.map((err: any) => {
          switch (err.code) {
            case 'string.base':
              return new Error('Name must be a string');
            case 'string.min':
              return new Error('Name must be at least 3 characters long');
            case 'any.required':
              return new Error('Name is required');
            default:
              return err;
          }
        });
      }),
    email: Joi.string()
      .email()
      .required()
      .error((errors: any) => {
        return errors.map((err: any) => {
          switch (err.code) {
            case 'string.email':
              return new Error('Email must be a valid email address');
            case 'any.required':
              return new Error('Email is required');
            default:
              return err;
          }
        });
      }),
    password: Joi.string()
      .min(8)
      .required()
      .error((errors: any) => {
        return errors.map((err: any) => {
          switch (err.code) {
            case 'string.min':
              return new Error('Password must be at least 6 characters long');
            case 'any.required':
              return new Error('Password is required');
            default:
              return err;
          }
        });
      }),
  }),
};
