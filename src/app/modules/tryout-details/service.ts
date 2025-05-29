import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { TryoutPackageDetailModel } from '../../../database/models/TryoutPackageDetailModel';
import { TryoutPackageModel } from '../../../database/models/TryoutPackageModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { selection } from './constanta';

export class TryoutDetailService {
  private repository = AppDataSource.getRepository(TryoutPackageDetailModel);

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

        if (!isNaN(searchTerm)) {
          whereCondition.push({
            passing_grade: Number(searchTerm),
          });
          whereCondition.push({
            total_questions: Number(searchTerm),
          });
        }
      }

      const [rows, count] = await this.repository.findAndCount({
        where: whereCondition?.length > 0 ? whereCondition : whereAnd,
        relations: {
          tryout_package: true,
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
        message: MessageDialog.__('success.tryout-details.fetch'),
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
          [SC.PrimaryKey.TryoutPackageDetails]: id,
        },
        relations: {
          tryout_package: true,
        },
        select: selection.default,
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
        message: MessageDialog.__('success.tryout-details.fetch'),
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
          message: MessageDialog.__('error.tryout-details.store', { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-details.store', { value: payload.name }),
        data: {
          [SC.PrimaryKey.TryoutPackageDetails]: result.package_id,
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
          [SC.PrimaryKey.TryoutPackageDetails]: id,
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

      const name: string = result?.name;
      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-details.update', { value: name }),
        data: {
          [SC.PrimaryKey.TryoutPackageDetails]: id,
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
          [SC.PrimaryKey.TryoutPackageDetails]: id,
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
        message: MessageDialog.__('success.tryout-details.delete', { value: name }),
        data: {
          [SC.PrimaryKey.TryoutPackageDetails]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
