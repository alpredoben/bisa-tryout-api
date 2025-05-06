import { Request, Response } from 'express';
import MainRoutes from '../../../config/routes.config';
import { multerUpload } from '../../../config/storage.config';
import Service from './service';

class ConverterDataController extends MainRoutes {
  public routes(): void {
    this.router.get('/', async (req: Request, res: Response) => {
      await Service.fetch(req, res);
    });

    this.router.post(
      '/import-excel',
      multerUpload({ type: 'single', name: 'file' }),
      async (req: Request, res: Response) => {
        await Service.excelImported(req, res);
      },
    );

    this.router.get('/check-import', async (req: Request, res: Response) => {
      await Service.checkImport(req, res);
    });

    this.router.get('/download-report', async (req: Request, res: Response) => {
      await Service.downloadReport(req, res);
    });

    this.router.get('/download-excel/:history_id', async (req: Request, res: Response) => {
      await Service.downloadTransaction(req, res);
    });
  }
}

export default new ConverterDataController().router;
