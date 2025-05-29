import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageModel } from '../../../database/models/TryoutPackageModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { selection } from './constanta';

export class TryoutPackageService {
  private repository = AppDataSource.getRepository(TryoutPackageModel);

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      let whereCondition: Record<string, any>[] = [];
      let whereAnd: FindOptionsWhere<TryoutPackageModel> = {
        deleted_at: IsNull(),
      };

      if (queries?.category_id) {
        whereAnd.category_id = queries.category_id;
      }

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
        relations: {
          tryout_category: true,
        },
        select: selection.default,
        skip: Number(paging?.skip),
        take: Number(paging?.limit),
        order: sorting,
      });

      const pagination: I_ResponsePagination = setPagination(rows, count, paging?.page, paging?.limit);

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-package.fetch'),
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
          [SC.PrimaryKey.TryoutPackages]: id,
        },
        relations: {
          tryout_category: true,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'paket tryout' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-package.fetch'),
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
          message: MessageDialog.__('error.tryout-package.store', { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-package.store', { value: payload.name }),
        data: {
          [SC.PrimaryKey.TryoutPackages]: result.package_id,
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
          [SC.PrimaryKey.TryoutPackages]: id,
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

      const name: string = result?.name;
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-package.update', { value: name }),
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
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'paket tryout' }),
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
        message: MessageDialog.__('success.tryout-package.delete', { value: name }),
        data: {
          [SC.PrimaryKey.TryoutPackages]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
