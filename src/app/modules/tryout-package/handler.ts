import { Response } from 'express';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../utils/request.util';
import { sendResponseJson } from '../../../utils/response.util';
import { columns, sortItem } from './constanta';
import { TryoutPackageService } from './service';

class TryoutPackageHandler {
  private readonly service = new TryoutPackageService();

  bodyValidation(req: I_RequestCustom): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.[columns.category_id]) {
      payload.category_id = req?.body?.[columns.category_id];
    }

    if (req?.body?.[columns.stage_id]) {
      payload.stage_id = req?.body?.[columns.stage_id];
    }

    if (req?.body?.total_questions) {
      payload.total_questions = req?.body?.total_questions;
    }

    if (req?.body?.order_number) {
      payload.order_number = req?.body?.order_number;
    }

    return payload;
  }

  async fetchParam(req: I_RequestCustom, res: Response): Promise<Response> {
    const filters: Record<string, any> = {
      paging: defineRequestPaginateArgs(req),
      sorting: defineRequestOrderORM(req, sortItem.default, sortItem.request),
      queries: req?.query,
    };
    const result = await this.service.fetchPagination(filters);
    return sendResponseJson(res, result);
  }

  async findById(req: I_RequestCustom, res: Response): Promise<Response> {
    const id: string = req?.params?.[columns.id];
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
    const id: string = req?.params?.[columns.id];
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
    const id: string = req?.params?.[columns.id];
    let payload: Record<string, any> = {
      deleted_at: today,
      deleted_by: req?.user?.user_id,
    };

    const result = await this.service.softDelete(req, id, payload);
    return sendResponseJson(res, result);
  }
}

export default new TryoutPackageHandler();
