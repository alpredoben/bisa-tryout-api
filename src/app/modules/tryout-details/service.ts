import { Brackets, IsNull } from 'typeorm';
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
      const searchTerm = paging?.search;

      const queryBuilder = this.repository
        .createQueryBuilder('detail')
        .leftJoinAndSelect('detail.package', 'package')
        .leftJoinAndSelect('detail.type', 'type');

      if (queries?.package_id) {
        queryBuilder.andWhere('detail.package_id = :id', {
          id: queries.package_id,
        });
      }

      if (searchTerm) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('package.package_name ILIKE :search', { search: `%${searchTerm}%` }).orWhere(
              'type.name ILIKE :search',
              { search: `%${searchTerm}%` },
            );
          }),
        );
      }

      const dataQuery = queryBuilder
        .clone()
        .select([
          'detail.detail_id AS detail_id',
          'detail.total_questions AS total_questions',
          'detail.total_duration AS total_duration',
          'detail.satuan_duration AS satuan_duration',
          'detail.passing_grade AS passing_grade',
          'detail.mode_answer AS mode_answer',
          'detail.order_number AS order_number',
          'package.package_name AS package_name',
          'type.name AS type_name',
          'detail.package_id AS package_id',
          'detail.type_id AS type_id',
          'detail.created_at AS created_at',
          'detail.updated_at AS updated_at',
        ]);

      const countQuery = queryBuilder.clone().select('detail.detail_id');

      if (sorting) {
        Object.entries(sorting).forEach(([key, value]) => {
          dataQuery.addOrderBy(key, value?.toString()?.toUpperCase() == 'ASC' ? 'ASC' : 'DESC');
        });
      }

      const [rows, count] = await Promise.all([dataQuery.getRawMany(), countQuery.getCount()]);

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
          type: true,
        },
        select: {
          detail_id: true,
          passing_grade: true,
          total_duration: true,
          satuan_duration: true,
          total_questions: true,
          mode_answer: true,
          created_at: true,
          updated_at: true,
          order_number: true,
          package: {
            package_id: true,
            package_name: true,
            total_questions: true,
            mode_layout: true,
            category: {
              category_id: true,
              name: true,
              prices: true,
              description: true,
              year: true,
            },
            stage: {
              stage_id: true,
              name: true,
              description: true,
            },
          },
          type: {
            type_id: true,
            name: true,
            description: true,
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
          [columns.id]: result.detail_id,
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
