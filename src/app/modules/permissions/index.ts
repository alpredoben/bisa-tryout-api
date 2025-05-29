import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { CS_DbSchema as Schema } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Handler from './handler';
import { PermissionValidation } from './validation';

class PermissionRouter extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchParam(req, res);
    });

    this.router.get(
      `/:${Schema.PrimaryKey.Permission}`,
      PermissionValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.findById(req, res);
      },
    );

    this.router.post('/', PermissionValidation.created, async (req: I_RequestCustom, res: Response) => {
      await Handler.store(req, res);
    });

    this.router.put(
      `/:${Schema.PrimaryKey.Permission}`,
      PermissionValidation.updated,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.update(req, res);
      },
    );

    this.router.delete(
      `/:${Schema.PrimaryKey.Permission}`,
      PermissionValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.softDelete(req, res);
      },
    );
  }
}

export default new PermissionRouter().router;
