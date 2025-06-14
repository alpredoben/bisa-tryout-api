import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { HistoryReportedTryoutModel } from '../../../database/models/HistoryReportedTryoutModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';

export class HistoryTryoutService {
  private repository = AppDataSource.getRepository(HistoryReportedTryoutModel);

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      let whereCondition: Record<string, any>[] = [];
      let whereAnd: FindOptionsWhere<HistoryReportedTryoutModel> = {
        deleted_at: IsNull(),
      };

      if (queries?.history_type && queries?.history_type != 'all') {
        whereAnd.history_type = queries.history_type;
      }

      if (queries?.history_status && queries?.history_status != 'all') {
        whereAnd.history_status = queries.history_status;
      }

      if (paging?.search) {
        const searchTerm: any = paging?.search;
        whereCondition = [
          {
            history_status: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
          {
            history_type: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
          {
            description: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
        ];
      }

      const [rows, count] = await this.repository.findAndCount({
        where: whereCondition?.length > 0 ? whereCondition : whereAnd,
        skip: Number(paging?.skip),
        take: Number(paging?.limit),
        order: sorting,
      });

      const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.history-tryout.fetch'),
        data: pagination,
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async create(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.save(
        this.repository.create({
          ...payload,
        }),
      );

      if (!result) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.history-tryout.store', { value: payload.history_type }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.history-tryout.store', { value: payload.history_type }),
        data: {
          [SC.PrimaryKey.HistoryReportTryout]: result.history_id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async update(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          [SC.PrimaryKey.HistoryReportTryout]: id,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'riwayat paket tryout' }),
          data: result,
        };
      }

      const name: string = result?.history_type;
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.history-tryout.update', { value: name }),
        data: {
          [SC.PrimaryKey.HistoryReportTryout]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
