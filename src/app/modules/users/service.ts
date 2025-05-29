import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { CS_DbSchema as SC } from '../../../constanta';
import { RoleMenuModel } from '../../../database/models/RoleMenuModel';
import { UserModel } from '../../../database/models/UserModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { encryptPassword } from '../../../utils/bcrypt.util';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { FileService } from '../files/service';
import { selection } from './constanta';

export class UserService {
  private repository = AppDataSource.getRepository(UserModel);
  private repoRoleMenu = AppDataSource.getRepository(RoleMenuModel);
  private fileService = new FileService();

  async fetchPagination(filters: Record<string, any>): Promise<I_ExpressResponse> {
    const { paging, sorting, queries } = filters;
    try {
      let whereCondition: Record<string, any>[] = [];
      let whereAnd: FindOptionsWhere<UserModel> = {
        deleted_at: IsNull(),
      };

      if (queries?.role_id) {
        whereAnd = {
          role: {
            role_id: queries.role_id,
          },
          ...whereAnd,
        };
      }

      if (paging?.search) {
        const searchTerm: any = paging?.search;
        whereCondition = [
          {
            name: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
          {
            email: ILike(`%${searchTerm}%`),
            ...whereAnd,
          },
          {
            phone: ILike(`%${searchTerm}%`),
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
        message: MessageDialog.__('success.users.fetch'),
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
          user_id: id,
        },
        relations: {
          role: true,
        },
        select: selection.default,
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
          data: result,
        };
      }

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.users.fetch'),
        data: result,
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async getProfile(id: string): Promise<I_ExpressResponse> {
    try {
      const rowUser = await this.repository.findOne({
        where: {
          deleted_at: IsNull(),
          user_id: id,
        },
        relations: {
          role: true,
        },
        select: selection.default,
      });

      if (!rowUser) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'user' }),
          data: rowUser,
        };
      }

      const rowMenu = await this.repoRoleMenu.find({
        where: {
          deleted_at: IsNull(),
          role: {
            role_id: rowUser?.role.role_id,
          },
          menu: {
            parent_id: IsNull(),
          },
        },
        select: {
          item_id: true,
          menu: {
            menu_id: true,
            name: true,
            slug: true,
            icon: true,
            order_number: true,
            childrens: {
              menu_id: true,
              name: true,
              slug: true,
              icon: true,
              order_number: true,
              childrens: {
                menu_id: true,
                name: true,
                slug: true,
                icon: true,
                order_number: true,
              },
            },
            role_menu_access: {
              access_permissions: {
                access_id: true,
                permission: {
                  permission_id: true,
                  name: true,
                  order_number: true,
                },
              },
            },
          },
          access_permissions: {
            access_id: true,
            permission: {
              permission_id: true,
              name: true,
              order_number: true,
            },
          },
        },
        relations: [
          'access_permissions',
          'access_permissions.permission',
          'menu',
          'menu.childrens',
          'menu.childrens.role_menu_access',
          'menu.childrens.role_menu_access.access_permissions',
          'menu.childrens.role_menu_access.access_permissions.permission',
          'menu.childrens.childrens',
          'menu.childrens.childrens.role_menu_access',
          'menu.childrens.childrens.role_menu_access.access_permissions',
          'menu.childrens.childrens.role_menu_access.access_permissions.permission',
        ],
        order: {
          menu: {
            order_number: 'ASC',
            childrens: {
              order_number: 'ASC',
              childrens: {
                order_number: 'ASC',
                role_menu_access: {
                  access_permissions: {
                    permission: {
                      order_number: 'ASC',
                    },
                  },
                },
              },
              role_menu_access: {
                access_permissions: {
                  permission: {
                    order_number: 'ASC',
                  },
                },
              },
            },
          },
          access_permissions: {
            permission: {
              order_number: 'ASC',
            },
          },
        },
      });

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.users.fetch'),
        data: {
          ...rowUser,
          list_menu_access: rowMenu,
        },
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
      if (payload?.confirm_password) {
        delete payload?.confirm_password;
      }

      if (payload?.password) {
        const { password_hash } = await encryptPassword(payload.password);
        payload.password = password_hash;
      }

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
          photo: fileDesc,
        }),
      );

      if (!result) {
        await queryRunner.rollbackTransaction();
        return {
          success: false,
          code: 400,
          message: MessageDialog.__('error.users.store', { value: payload.name }),
          data: result,
        };
      }

      // Log Activity
      // Notification

      await queryRunner.commitTransaction();
      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.users.store', { value: payload.name }),
        data: {
          [SC.PrimaryKey.User]: result.user_id,
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
          user_id: id,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'pengguna' }),
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
        message: MessageDialog.__('success.users.update', { value: name }),
        data: {
          [SC.PrimaryKey.User]: id,
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
          user_id: id,
          deleted_at: IsNull(),
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'pengguna' }),
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
        message: MessageDialog.__('success.users.delete', { value: name }),
        data: {
          [SC.PrimaryKey.User]: id,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
