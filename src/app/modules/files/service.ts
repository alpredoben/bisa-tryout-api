import { IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { uploadFile } from '../../../config/storage.config';
import { FileStorageModel } from '../../../database/models/FileStorageModel';
import { I_ExpressResponse, I_RequestCustom } from '../../../interfaces/app.interface';
import { MessageDialog } from '../../../lang';
import { standartDateISO } from '../../../utils/common.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { UserService } from '../users/service';

export class FileService {
  private repository = AppDataSource.getRepository(FileStorageModel);

  private _userService?: UserService;

  private get userService(): UserService {
    if (!this._userService) {
      this._userService = new UserService();
    }
    return this._userService;
  }

  async uploaded(req: I_RequestCustom): Promise<I_ExpressResponse> {
    try {
      const today: Date = new Date(standartDateISO());
      const result = await uploadFile(req);

      if (!result?.success) {
        return result;
      }

      const { file_name, file_url } = result.data;

      const resultStore = await this.repository.save(
        this.repository.create({
          file_desc: `Upload file ${req?.file?.originalname} with size ${req?.file?.size}`,
          file_name: file_name,
          file_url: file_url,
          created_at: today,
          created_by: req?.user?.user_id,
        }),
      );

      if (!resultStore) {
        return {
          success: false,
          message: MessageDialog.__(''),
          code: 400,
          data: resultStore,
        };
      }

      return {
        success: true,
        message: result.message,
        code: 200,
        data: {
          file_id: resultStore.file_id,
          file_url: resultStore.file_url,
          file_name: resultStore.file_name,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async fetchById(id: string): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({ where: { file_id: id } });

      if (!result) {
        return {
          success: false,
          message: MessageDialog.__('error.default.notFoundItem', { value: `Kode File ${id}` }),
          code: 404,
          data: result,
        };
      }

      return {
        success: true,
        message: MessageDialog.__('success.default.foundItem', { value: 'File' }),
        code: 200,
        data: result,
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }

  async updateFile(req: I_RequestCustom, payload: Record<string, any>): Promise<I_ExpressResponse> {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const { id, module_name } = payload;
    try {
      let images = null;
      let result = null;

      // Upload new file image
      const resultUpdate = await this.uploaded(req);

      if (!resultUpdate.success) {
        await queryRunner.rollbackTransaction();
        return resultUpdate;
      }

      const payloadImage = resultUpdate.data;

      switch (module_name.toLowerCase()) {
        case 'users':
          result = await this.userService.findById(id);

          if (!result.success) {
            await queryRunner.rollbackTransaction();
            return result;
          }

          images = result.data.photo;

          result = await this.update(req, images.file_id, {
            deleted_at: new Date(standartDateISO()),
            deleted_by: req?.user?.user_id,
          });

          if (!result?.success) {
            await queryRunner.rollbackTransaction();
            return result;
          }

          result = await this.userService.update(req, id, {
            photo: payloadImage,
            updated_at: new Date(standartDateISO()),
            updated_by: req?.user?.user_id,
          });

          if (!result?.success) {
            await queryRunner.rollbackTransaction();
            return result;
          }
          break;

        default:
          break;
      }

      await queryRunner.commitTransaction();
      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.files.update'),
        data: payloadImage,
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
          file_id: id,
        },
      });

      if (!result) {
        return {
          success: false,
          code: 404,
          message: MessageDialog.__('error.default.notFoundItem', { item: 'file' }),
          data: result,
        };
      }

      const updateResult = { ...result, ...payload };
      await this.repository.save(updateResult);

      // Log Activity
      // Notification

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.files.update', { value: result.file_name }),
        data: {
          file_id: updateResult.file_id,
          file_name: updateResult.file_name,
          file_url: updateResult.file_url,
        },
      };
    } catch (error: any) {
      return setupErrorMessage(error);
    }
  }
}
