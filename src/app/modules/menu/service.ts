import { IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { MenuModel } from '../../../database/models/MenuModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { setupErrorMessage } from '../../../utils/response.util';
import { FileService } from '../files/service';

export class MenuService {
  private repository = AppDataSource.getRepository(MenuModel);
  private fileService = new FileService();

  async fetch(): Promise<I_ExpressResponse> {
    try {
      const results = await this.repository.find({
        where: {
          deleted_at: IsNull(),
          parent_id: IsNull(),
        },
        relations: ['childrens', 'childrens.childrens'],
        order: {
          order_number: 'ASC',
          childrens: {
            order_number: 'ASC',
            childrens: {
              order_number: 'ASC',
              childrens: {
                order_number: 'ASC',
              },
            },
          },
        },
      });

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.menu.fetch'),
        data: results,
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
          menu_id: id,
        },
        relations: ['childrens', 'childrens.childrens'],
        order: {
          childrens: {
            order_number: 'ASC',
          },
        },
      });

      console.log({ RESULTS: result });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'menu' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.menu.fetch'),
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
          message: MessageDialog.__('error.menu.store', { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      await queryRunner.commitTransaction();
      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.menu.store', { value: payload.name }),
        data: {
          [SC.PrimaryKey.Menu]: result.menu_id,
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
          menu_id: id,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'menu' }),
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
        message: MessageDialog.__('success.menu.update', { value: name }),
        data: {
          [SC.PrimaryKey.Menu]: id,
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
          menu_id: id,
          deleted_at: IsNull(),
        },
        relations: {
          role_menu_access: true,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'menu' }),
          data: result,
        };
      }

      if (result?.role_menu_access?.length > 0) {
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.menu.cannot'),
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
        message: MessageDialog.__('success.menu.delete', { value: name }),
        data: {
          [SC.PrimaryKey.Menu]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
