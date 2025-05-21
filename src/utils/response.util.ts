import { Response } from 'express';
import { I_ExpressResponse } from '../interfaces/app.interface';

export const setResponse = (success: boolean, message: string, data: any = {}) => {
  return {
    success,
    message,
    data,
  };
};

/**
 * Constructs a success response object.
 * @param message - The success message.
 * @param data - The data to include in the response.
 * @returns An object containing the success template.
 */
export const sendSuccessResponse = (res: Response, code: number, message: string, data: any = {}): Response => {
  return res.status(code).json(setResponse(true, message, data));
};

/**
 * Constructs an error response object.
 * @param message - The error message.
 * @param error - Additional error details (optional).
 * @returns An object containing the error template.
 */
export const sendErrorResponse = (res: Response, code: number, message: string, data: any = null): Response => {
  return res.status(code).json(setResponse(false, message, data));
};

export const setupErrorMessage = (error: any): I_ExpressResponse => {
  return {
    success: false,
    message: error.message,
    code: 400,
    data: error,
  };
};

export const sendResponseJson = (res: Response, result: I_ExpressResponse): Response => {
  return res.status(result.code).json(setResponse(result.success, result.message, result.data));
};
