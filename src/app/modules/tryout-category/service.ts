import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutCategoryModel } from '../../../database/models/TryoutCategoryModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { FileService } from '../files/service';
import { selection } from './constanta';

export class TryoutCategoryService {
  private repository = AppDataSource.getRepository(TryoutCategoryModel);
  private fileService = new FileService();

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting } = filters;
    try {
      let whereCondition: Record<string, any>[] = [];
      let whereAnd: FindOptionsWhere<TryoutCategoryModel> = {
        deleted_at: IsNull(),
      };

      if (paging?.search) {
        const searchTerm: any = paging?.search;
        whereCondition = [
          {
            name: ILike(`%${searchTerm}%`),
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
        select: selection.default,
        skip: Number(paging?.skip),
        take: Number(paging?.limit),
        order: sorting,
      });

      const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-category.fetch'),
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
          category_id: id,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'tryout category' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-category.fetch'),
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
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'tryout category' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-category.fetch'),
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
          message: MessageDialog.__('error.tryout-category.store', { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      await queryRunner.commitTransaction();
      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-category.store', { value: payload.name }),
        data: {
          [SC.PrimaryKey.TryoutCategories]: result.category_id,
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
          [SC.PrimaryKey.TryoutCategories]: id,
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
        message: MessageDialog.__('success.tryout-category.update', { value: name }),
        data: {
          [SC.PrimaryKey.TryoutCategories]: id,
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
          [SC.PrimaryKey.TryoutCategories]: id,
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
        message: MessageDialog.__('success.tryout-category.delete', { value: name }),
        data: {
          [SC.PrimaryKey.TryoutCategories]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
