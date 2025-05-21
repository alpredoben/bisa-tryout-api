import { Request, Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { authMiddleware } from '../../middlewares/auth.middleware';
import Handler from './handler';
import { AuthValidation } from './validation';

class AuthRouter extends MainRoutes {
  public routes(): void {
    this.router.post('/login', AuthValidation.login, async (req: Request, res: Response) => {
      await Handler.login(req, res);
    });

    this.router.post(`/register`, AuthValidation.register, async (req: Request, res: Response) => {
      await Handler.register(req, res);
    });

    this.router.get('/profile', authMiddleware, async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchProfile(req, res);
    });
  }
}

export default new AuthRouter().router;
