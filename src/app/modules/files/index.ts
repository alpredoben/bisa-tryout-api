import { Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { fetchFileFromStorage, multerUpload } from '../../../config/storage.config';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { authMiddleware } from '../../middlewares/auth.middleware';
import Handler from './handler';

class FileRouter extends MainRoutes {
  public routes(): void {
    this.router.post(
      '/',
      authMiddleware,
      multerUpload({ type: 'single', name: 'file' }),
      async (req: I_RequestCustom, res: Response) => {
        await Handler.uploadFile(req, res);
      },
    );

    this.router.get('/:filename', async (req: I_RequestCustom, res: Response) => {
      await fetchFileFromStorage(req, res);
    });

    this.router.put(
      '/:module_name/:id',
      authMiddleware,
      multerUpload({ type: 'single', name: 'file' }),
      async (req: I_RequestCustom, res: Response) => {
        await Handler.updateFile(req, res);
      },
    );

    this.router.delete('/:filename', authMiddleware, async (req: I_RequestCustom, res: Response) => {
      await Handler.deleteFile(req, res);
    });
  }
}

export default new FileRouter().router;
