import { Response } from 'express';
import { CS_DbSchema as SC } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../utils/common.util';
import { sendResponseJson } from '../../../utils/response.util';
import { MenuService } from './service';

class MenuHandler {
  private readonly service = new MenuService();

  bodyValidation(req: I_RequestCustom): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.name) {
      payload.name = req?.body?.name;
    }

    if (req?.body?.slug) {
      payload.slug = req?.body?.slug;
    }

    if (req?.body?.order_number) {
      payload.order_number = req?.body?.order_number;
    }

    if (req?.body?.parent_id) {
      payload.parent_id = req?.body?.parent_id;
    }

    if (req?.body?.file_id) {
      payload.file_id = req?.body?.file_id;
    }

    if (req?.body?.is_sidebar) {
      payload.is_sidebar = req?.body?.is_sidebar;
    }

    return payload;
  }

  async fetchParam(req: I_RequestCustom, res: Response): Promise<Response> {
    const result = await this.service.fetch();
    return sendResponseJson(res, result);
  }

  async findById(req: I_RequestCustom, res: Response): Promise<Response> {
    const id: string = req?.params?.[SC.PrimaryKey.Menu];
    const result = await this.service.findById(id);
    return sendResponseJson(res, result);
  }

  async store(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());

    let payload: Record<string, any> = {
      created_at: today,
      created_by: req?.user?.user_id,
      ...this.bodyValidation(req),
    };

    const result = await this.service.create(req, payload);
    return sendResponseJson(res, result);
  }

  async update(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());
    const id: string = req?.params?.[SC.PrimaryKey.Menu];
    let payload: Record<string, any> = {
      updated_at: today,
      updated_by: req?.user?.user_id,
      ...this.bodyValidation(req),
    };

    const result = await this.service.update(req, id, payload);
    return sendResponseJson(res, result);
  }

  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());
    const id: string = req?.params?.[SC.PrimaryKey.Menu];
    let payload: Record<string, any> = {
      deleted_at: today,
      deleted_by: req?.user?.user_id,
    };

    const result = await this.service.softDelete(req, id, payload);
    return sendResponseJson(res, result);
  }
}

export default new MenuHandler();
