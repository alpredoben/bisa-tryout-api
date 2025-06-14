import { Response } from 'express';
import { I_RequestCustom } from '../../../interfaces/app.interface';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../utils/request.util';
import { sendResponseJson } from '../../../utils/response.util';
import { sortItem } from './constanta';
import { HistoryTryoutService } from './services';

class HistoryTryoutHandler {
  private readonly service = new HistoryTryoutService();

  async fetchParam(req: I_RequestCustom, res: Response): Promise<Response> {
    const filters: Record<string, any> = {
      paging: defineRequestPaginateArgs(req),
      sorting: defineRequestOrderORM(req, sortItem.default, sortItem.request),
      queries: req?.query,
    };
    const result = await this.service.fetchPagination(filters);
    return sendResponseJson(res, result);
  }
}

export default new HistoryTryoutHandler();
