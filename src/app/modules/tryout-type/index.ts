import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { columns } from './constanta';
import Handler from './handler';
import { TryoutTypeValidation as Validation } from './validation';

class TryoutTypeRouter extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchParam(req, res);
    });

    this.router.get(`/:${columns.id}`, Validation.findId, async (req: I_RequestCustom, res: Response) => {
      await Handler.findById(req, res);
    });

    this.router.post('/', Validation.created, async (req: I_RequestCustom, res: Response) => {
      await Handler.store(req, res);
    });

    this.router.put(`/:${columns.id}`, Validation.updated, async (req: I_RequestCustom, res: Response) => {
      await Handler.update(req, res);
    });

    this.router.delete(`/:${columns.id}`, Validation.findId, async (req: I_RequestCustom, res: Response) => {
      await Handler.softDelete(req, res);
    });
  }
}

export default new TryoutTypeRouter().router;
