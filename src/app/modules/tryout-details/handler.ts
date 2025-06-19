import { Response } from 'express';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { standartDateISO } from '../../../utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../utils/request.util';
import { sendResponseJson } from '../../../utils/response.util';
import { columns, sortItem } from './constanta';
import { TryoutDetailService } from './service';

class TryoutDetailHandler {
  private readonly service = new TryoutDetailService();

  bodyValidation(req: I_RequestCustom): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.package_id) {
      payload.package_id = req?.body?.package_id;
    }

    if (req?.body?.type_id) {
      payload.type_id = req?.body?.type_id;
    }

    if (req?.body?.total_questions) {
      payload.total_questions = req?.body?.total_questions;
    }

    if (req?.body?.total_duration && req?.body?.total_duration) {
      payload.total_duration = req?.body?.total_duration;
    }

    if (req?.body?.satuan_duration && req?.body?.satuan_duration) {
      payload.satuan_duration = req?.body?.satuan_duration;
    }

    if (req?.body?.passing_grade) {
      payload.passing_grade = req?.body?.passing_grade;
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

export default new TryoutDetailHandler();
