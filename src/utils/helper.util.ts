import { I_ExpressResponse } from '../interfaces/app.interface';

export const setupResponseMessage = (
  success: boolean,
  data: Record<string, any> | any,
  message: any = null,
  code: number = 500,
): I_ExpressResponse => {
  if (success == false) {
    return {
      success,
      data,
      message: message == null ? data.message : message,
      code: code == 500 ? 500 : code,
    };
  }

  return {
    success,
    data,
    message,
    code,
  };
};
