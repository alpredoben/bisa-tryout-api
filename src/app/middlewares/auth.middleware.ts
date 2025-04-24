import { Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../utils/response.util';
import { MessageDialog } from '../../lang';
import { verifiedToken } from '../../utils/jwt.util';
import { I_RequestCustom } from '../../interfaces/app.interface';
import AppDataSource from '../../config/db.config';
import { UserModel } from '../../database/models/UserModel';

export const authMiddleware = async (req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.auth.deniedToken'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifiedToken(token);

      const user = await AppDataSource.getRepository(UserModel).findOne({
        where: { user_id: decoded?.user_id }
      });

      if (!user) {
        sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { value: 'Data pengguna' }))
      }

      // Cek apakah password diubah setelah token dibuat
      if (user?.password_change_at && user?.password_change_at != null) {
        const changedTimestamp = Math.floor(user.password_change_at.getTime() / 1000);
        if (decoded?.iat && decoded?.iat < changedTimestamp) {
          sendErrorResponse(res, 400, MessageDialog.__('error.default.changePassword'))
        }
      }

      req.user = decoded
      next();
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.auth.invalidToken'), error);
    }
  }
};

export const adminAuthMiddleware = async (req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.auth.deniedToken'), authHeader);
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifiedToken(token);
      const roleSlug: any = decoded?.role?.role_slug;

      if (['admin', 'developer'].includes(roleSlug)) {
        const user = await AppDataSource.getRepository(UserModel).findOne({
          where: { user_id: decoded?.user_id }
        });

        if (!user) {
          sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { value: 'Data pengguna' }))
        }

        // Cek apakah password diubah setelah token dibuat
        if (user?.password_change_at && user?.password_change_at != null) {
          const changedTimestamp = Math.floor(user.password_change_at.getTime() / 1000);
          if (decoded?.iat && decoded?.iat < changedTimestamp) {
            sendErrorResponse(res, 400, MessageDialog.__('error.default.changePassword'))
          }
        }

        req.user = decoded
        next()
      } else {
        sendErrorResponse(res, 401, MessageDialog.__('error.auth.deniedAccess', { value: roleSlug }), null)
      }
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.auth.invalidToken'), error);
    }
  }
};

