import { NextFunction, Request, Response } from 'express';
import { IsProduction } from '../../environments';
import { I_AppError } from '../../interfaces/app.interface';
import { MessageDialog } from '../../lang';
import { sendErrorResponse } from '../../utils/response.util';

export const errorMiddleware = (err: I_AppError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || MessageDialog.__('error.default.internalServer');
  console.error(`[Error] : ${message}`, err);
  sendErrorResponse(res, statusCode, message, err);
  next();
};

/** Remove Favicon Middleware */
export const removeFaviconMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.url === '/favicon.ico') {
    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
    res.end();
  } else {
    next();
  }
};

/** Syntax Error Middleware*/
export const syntaxErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  let messageError: string = `syntax error ${err}`;

  if (err instanceof SyntaxError) {
    if (!IsProduction) {
      sendErrorResponse(res, 400, err.message, err);
    }

    sendErrorResponse(res, 400, messageError, err);
  }
  next();
};
