import { Response } from 'express';
import { makeFileExcel } from '../../../config/excel.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { formatDateToday, standartDateISO } from '../../../utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../utils/request.util';
import { sendResponseJson } from '../../../utils/response.util';
import { excelHeaders, sortItem } from './constanta';
import { TryoutPackageService } from './service';

class TryoutPackageHandler {
  private readonly service = new TryoutPackageService();

  bodyValidation(req: I_RequestCustom): Record<string, any> {
    let payload: Record<string, any> = {};

    if (req?.body?.name) {
      payload.name = req?.body?.name;
    }

    if (req?.body?.description) {
      payload.description = req?.body?.description;
    }

    if (req?.body?.prices) {
      payload.prices = req?.body?.prices;
    }

    if (req?.body?.category_id) {
      payload.category_id = req?.body?.category_id;
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
    const id: string = req?.params?.[SC.PrimaryKey.TryoutPackages];
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
    const id: string = req?.params?.[SC.PrimaryKey.TryoutPackages];
    let payload: Record<string, any> = {
      updated_at: today,
      updated_by: req?.user?.user_id,
      ...this.bodyValidation(req),
    };

    const result = await this.service.update(req, id, payload);
    return sendResponseJson(res, result);
  }

  async imported(req: I_RequestCustom, res: Response): Promise<Response> {
    const result = await this.service.excelImported(req);
    return sendResponseJson(res, result);
  }

  async softDelete(req: I_RequestCustom, res: Response): Promise<Response> {
    const today: Date = new Date(standartDateISO());
    const id: string = req?.params?.[SC.PrimaryKey.TryoutPackages];
    let payload: Record<string, any> = {
      deleted_at: today,
      deleted_by: req?.user?.user_id,
    };

    const result = await this.service.softDelete(req, id, payload);
    return sendResponseJson(res, result);
  }

  async downloadTemplate(req: I_RequestCustom, res: Response): Promise<Response> {
    const result = await this.service.downloadTemplate();

    if (!result?.success) {
      return sendResponseJson(res, result);
    }

    const fileName = `TemplatePaketTrout_${formatDateToday('YYYYMMDDHHmmss', new Date(standartDateISO()))}`;
    const headers = excelHeaders.map((x: any) => x.header);
    return await makeFileExcel(res, {
      fileName,
      headers,
      data: result.data,
      sheetName: 'Paket Trayout',
    });
  }
}

export default new TryoutPackageHandler();
