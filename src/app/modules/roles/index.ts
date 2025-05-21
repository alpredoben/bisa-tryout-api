import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { CS_DbSchema as Schema } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import Handler from './handler';
import { RoleValidation } from './validation';

class RoleRouter extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: I_RequestCustom, res: Response) => {
      await Handler.fetchParam(req, res);
    });

    this.router.get(
      `/:${Schema.PrimaryKey.Role}`,
      RoleValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.findById(req, res);
      },
    );

    this.router.post('/', RoleValidation.created, async (req: I_RequestCustom, res: Response) => {
      await Handler.store(req, res);
    });

    this.router.put(
      `/:${Schema.PrimaryKey.Role}`,
      RoleValidation.updated,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.update(req, res);
      },
    );

    this.router.delete(
      `/:${Schema.PrimaryKey.Role}`,
      RoleValidation.findId,
      async (req: I_RequestCustom, res: Response) => {
        await Handler.softDelete(req, res);
      },
    );
  }
}

export default new RoleRouter().router;
