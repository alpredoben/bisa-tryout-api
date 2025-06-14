import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Handler from './handler';

class HistoryTryoutRouter extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchParam(req, res);
    });
  }
}

export default new HistoryTryoutRouter().router;
