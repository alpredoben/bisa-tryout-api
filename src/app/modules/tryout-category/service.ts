import { Brackets, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { TryoutCategoryModal } from '../../../database/models/TryoutCategoryModal';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { FileService } from '../files/service';
import { columns, selection } from './constanta';

const MSG_LABEL: string = 'tryout-category';

export class TryoutCategoryService {
  private repository = AppDataSource.getRepository(TryoutCategoryModal);
  private fileService = new FileService();

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      const searchTerm = paging?.search;

      const queryBuilder = this.repository
        .createQueryBuilder('tryout_category')
        .leftJoinAndSelect('tryout_category.organization', 'organization')
        .where('tryout_category.deleted_at IS NULL');

      if (queries?.organization_id) {
        queryBuilder.andWhere('tryout_category.organization_id = :id', {
          id: queries.organization_id,
        });
      }

      if (searchTerm) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            qb.where('tryout_category.name ILIKE :search', { search: `%${searchTerm}%` }).orWhere(
              'tryout_category.description ILIKE :search',
              { search: `%${searchTerm}%` },
            );
          }),
        );
      }

      const dataQuery = queryBuilder
        .clone()
        .select([
          'tryout_category.category_id AS category_id',
          'organization.organization_id AS organization_id',
          'organization.name AS organization_name',
          'organization.icon AS organization_icon',
          'tryout_category.name AS name',
          'tryout_category.description AS description',
          'tryout_category.prices AS prices',
          'tryout_category.year AS year',
          'tryout_category.created_at AS created_at',
          'tryout_category.updated_at AS updated_at',
        ])
        .skip(Number(paging?.skip))
        .take(Number(paging?.limit));

      const countQuery = queryBuilder.clone().select('tryout_category.category_id');

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
          organization: true,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'kategori tryout' }),
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

  async findByCondition(condition: Record<string, any>): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          ...condition,
        },
        relations: {
          organization: true,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'kategori tryout' }),
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
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    let fileDesc = null;
    try {
      if (payload?.file_id) {
        const result = await this.fileService.update(req, payload?.file_id, {
          updated_at: payload.created_at,
          updated_by: payload.created_by,
          has_used: true,
        });

        if (!result.success) {
          await queryRunner.rollbackTransaction();
          return result;
        }

        fileDesc = result.data;
        delete payload?.file_id;
      }

      const result = await this.repository.save(
        this.repository.create({
          ...payload,
          icon: fileDesc,
        }),
      );

      if (!result) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          code: 400,
          message: MessageDialog.__(`error.${MSG_LABEL}.store`, { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      await queryRunner.commitTransaction();
      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.store`, { value: payload.name }),
        data: {
          [columns.id]: result.category_id,
        },
      };
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      return setupErrorMessage(error);
    } finally {
      await queryRunner.release();
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
          message: MessageDialog.__('error.default.notFoundItem', { item: 'kategori tryout' }),
          data: result,
        };
      }

      const name: string = result?.name;
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__(`success.${MSG_LABEL}.update`, { value: name }),
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
          message: MessageDialog.__('error.default.notFoundItem', { item: 'kategori tryout' }),
          data: result,
        };
      }

      const name: string = result?.name;

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
