import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { TryoutDetailModal } from '../../../database/models/TryoutDetailModal';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { columns } from './constanta';

const MSG_LABEL: string = 'tryout-details';
export class TryoutDetailService {
  private repository = AppDataSource.getRepository(TryoutDetailModal);

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      let whereCondition: Record<string, any>[] = [];
      let whereAnd: FindOptionsWhere<TryoutDetailModal> = {
        deleted_at: IsNull(),
      };

      if (queries?.package_id) {
        whereAnd.package_id = queries.package_id;
      }

      if (paging?.search) {
        const searchTerm: any = paging?.search;
        whereCondition = [
          {
            total_duration: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
        ];

        if (!isNaN(searchTerm)) {
          whereCondition.push({
            passing_grade: Number(searchTerm),
          });
          whereCondition.push({
            total_questions: Number(searchTerm),
          });
          whereCondition.push({
            order_number: Number(searchTerm),
          });
        }
      }

      const [rows, count] = await this.repository.findAndCount({
        where: whereCondition?.length > 0 ? whereCondition : whereAnd,
        relations: {
          package: true,
          type: true,
        },
        select: {
          detail_id: true,
          package: {
            package_id: true,
            total_questions: true,
          },
          total_questions: true,
          total_duration: true,
          passing_grade: true,
          order_number: true,
          created_at: true,
          updated_at: true,
        },
        skip: Number(paging?.skip),
        take: Number(paging?.limit),
        order: sorting,
      });

      const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.fetch`),
        data: pagination,
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async findById(id: string): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          [columns.id]: id,
        },
        relations: {
          package: {
            category: true,
            stage: true,
          },
        },
        select: {
          detail_id: true,
          passing_grade: true,
          total_duration: true,
          total_questions: true,
          created_at: true,
          updated_at: true,
          order_number: true,
          package: {
            package_id: true,
            total_questions: true,
            category: {
              category_id: true,
              name: true,
              prices: true,
              description: true,
            },
            stage: {
              stage_id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'detail tryout' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.fetch`),
        data: result,
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
          message: MessageDialog.__(`error.${MSG_LABEL}.store`, { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.store`, { value: payload.name }),
        data: {
          [columns.id]: result.package_id,
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
          [columns.id]: id,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'detail tryout' }),
          data: result,
        };
      }

      const name: string = '';
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-details.update', { value: name }),
        data: {
          [columns.id]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async softDelete(req: I_RequestCustom, id: string, payload: Record<string, any>): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        where: {
          [columns.id]: id,
          deleted_at: IsNull(),
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'detail tryout' }),
          data: result,
        };
      }

      const name: string = '';

      const updateResult = {
        ...result,
        ...payload,
      };

      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-details.delete', { value: name }),
        data: {
          [columns.id]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
