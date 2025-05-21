import { NextFunction, Response } from 'express';
import { IsNull } from 'typeorm';
import AppDataSource from '../../config/db.config';
import { UserModel } from '../../database/models/UserModel';
import { I_RequestCustom } from '../../interfaces/app.interface';
import { MessageDialog } from '../../lang';
import { verifiedToken } from '../../utils/jwt.util';
import { sendErrorResponse } from '../../utils/response.util';

export const authMiddleware = async (req: I_RequestCustom, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req?.headers?.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    sendErrorResponse(res, 401, MessageDialog.__('error.auth.deniedToken'));
  } else {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = verifiedToken(token);

      const user = await AppDataSource.getRepository(UserModel).findOne({
        where: { user_id: decoded?.user_id, deleted_at: IsNull() },
      });

      if (!user) {
        sendErrorResponse(res, 404, MessageDialog.__('error.default.notFoundItem', { item: 'pengguna' }));
      }

      // Cek apakah password diubah setelah token dibuat
      if (user?.password_change_at && user?.password_change_at != null) {
        const changedTimestamp = Math.floor(user.password_change_at.getTime() / 1000);
        if (decoded?.iat && decoded?.iat < changedTimestamp) {
          sendErrorResponse(res, 400, MessageDialog.__('error.default.changePassword'));
        }
      }

      req.user = decoded;
      next();
    } catch (error: any) {
      sendErrorResponse(res, 401, MessageDialog.__('error.auth.invalidToken'), error);
    }
  }
};
