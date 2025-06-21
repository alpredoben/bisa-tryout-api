import { Brackets, IsNull, Not } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageModal } from '../../../database/models/TryoutPackageModal';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { columns, selection } from './constanta';

const MSG_LABEL: string = 'tryout-package';
export class TryoutPackageService {
  private repository = AppDataSource.getRepository(TryoutPackageModal);

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      const searchTerm = paging?.search;

      const queryBuilder = this.repository
        .createQueryBuilder('package')
        .leftJoin('package.category', 'category')
        .leftJoin('package.stage', 'stage')
        .where('package.deleted_at IS NULL');

      if (queries?.category_id) {
        queryBuilder.andWhere('category.category_id = :id', {
          id: queries.category_id,
        });
      }

      if (queries?.stage_id) {
        queryBuilder.andWhere('stage.stage_id = :id', {
          id: queries.stage_id,
        });
      }

      if (searchTerm) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('package.package_name ILIKE :search', { search: `%${searchTerm}%` })
              .orWhere('category.name ILIKE :search', { search: `%${searchTerm}%` })
              .orWhere('stage.name ILIKE :search', { search: `%${searchTerm}%` });
          }),
        );
      }

      const dataQuery = queryBuilder
        .clone()
        .select([
          'package.package_id AS package_id',
          'package.package_name AS package_name',
          'category.category_id AS category_id',
          'stage.stage_id AS stage_id',
          'category.name AS category_name',
          'category.prices AS category_prices',
          'category.year AS category_year',
          'stage.name AS stage_name',
          'package.order_number AS order_number',
          'package.total_questions AS total_questions',
          'package.mode_answer AS mode_answer',
          'package.created_at AS created_at',
          'package.updated_at AS updated_at',
        ]);

      const countQuery = queryBuilder.clone().select('package.package_id');

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
          category: true,
          stage: true,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'paket tryout' }),
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
      const findRow = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          category: {
            category_id: payload?.category_id,
          },
          stage: {
            stage_id: payload?.stage_id,
          },
        },
        relations: {
          category: true,
          stage: true,
        },
      });

      if (findRow) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.validator.exists', {
            value: `${findRow.category.name}, ${findRow.stage.name}`,
          }),
          data: findRow,
        };
      }

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
        relations: {
          category: true,
          stage: true,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'paket tryout' }),
          data: result,
        };
      }

      // Check existing
      const findRow = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          category: {
            category_id: payload?.category_id ? payload.category_id : result.category.category_id,
          },
          stage: {
            stage_id: payload?.stage_id ? payload.stage_id : result.stage.stage_id,
          },
          package_id: Not(id),
        },
        relations: {
          category: true,
          stage: true,
        },
      });

      if (findRow) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.validator.exists', {
            value: `${findRow.category.name}, ${findRow.stage.name}`,
          }),
          data: findRow,
        };
      }

      const name = `${result.category.name}, ${result.stage.name}`;
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.update`, { value: name }),
        data: {
          [SC.PrimaryKey.TryoutPackages]: id,
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
          [SC.PrimaryKey.TryoutPackages]: id,
          deleted_at: IsNull(),
        },
        relations: {
          category: true,
          stage: true,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'paket tryout' }),
          data: result,
        };
      }

      const name: string = `${result.category.name}, ${result.stage.name}`;

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
        message: MessageDialog.__(`success.${MSG_LABEL}.delete`, { value: name }),
        data: {
          [columns.id]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
