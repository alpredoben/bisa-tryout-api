import { Response } from 'express';
import { removeFileInStorage } from '../../../config/storage.config';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { sendResponseJson } from '../../../utils/response.util';
import { FileService } from './service';

class FileHandler {
  private readonly service = new FileService();
  async uploadFile(req: I_RequestCustom, res: Response): Promise<Response> {
    const result = await this.service.uploaded(req);
    return sendResponseJson(res, result);
  }

  async updateFile(req: I_RequestCustom, res: Response): Promise<Response> {
    const payload: Record<string, any> = {
      module_name: req?.params?.module_name,
      id: req?.params?.id,
    };
    const result = await this.service.updateFile(req, payload);
    return sendResponseJson(res, result);
  }

  async deleteFile(req: I_RequestCustom, res: Response): Promise<Response> {
    return await removeFileInStorage(req, res);
  }
}

export default new FileHandler();
