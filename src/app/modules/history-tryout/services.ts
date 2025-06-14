import { IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { HistoryReportedTryoutModel } from '../../../database/models/HistoryReportedTryoutModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { setupErrorMessage } from '../../../utils/response.util';

export class HistoryTryoutService {
  private repository = AppDataSource.getRepository(HistoryReportedTryoutModel);

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
