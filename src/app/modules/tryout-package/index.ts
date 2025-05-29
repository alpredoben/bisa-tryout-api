import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Handler from './handler';
import { TryoutPackageValidation } from './validation';

class TryoutPackageRouter extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchParam(req, res);
    });

    this.router.get(
      `/:${SC.PrimaryKey.TryoutPackages}`,
      TryoutPackageValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.findById(req, res);
      },
    );

    this.router.post('/', TryoutPackageValidation.created, async (req: I_RequestCustom, res: Response) => {
      await Handler.store(req, res);
    });

    this.router.put(
      `/:${SC.PrimaryKey.TryoutPackages}`,
      TryoutPackageValidation.updated,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.update(req, res);
      },
    );

    this.router.delete(
      `/:${SC.PrimaryKey.TryoutPackages}`,
      TryoutPackageValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.softDelete(req, res);
      },
    );
  }
}

export default new TryoutPackageRouter().router;
