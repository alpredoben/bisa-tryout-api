import { FindOptionsWhere, ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { extractFileExcel } from '../../../config/excel.config';
import { Logger } from '../../../config/logger.config';
import { CS_HistoryReportType, CS_StatusName, CS_TypeName, CS_DbSchema as SC } from '../../../constanta';
import { TryoutCategoryModel } from '../../../database/models/TryoutCategoryModel';
import { TryoutPackageModel } from '../../../database/models/TryoutPackageModel';
import { executePublishHistoryTryout } from '../../../events/publishers/history-tryout.publisher';
import { I_ExpressResponse, I_MetaHistory, I_RequestCustom } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setupResponseMessage } from '../../../utils/helper.util';
import { setPagination } from '../../../utils/pagination.util';
import { setupErrorMessage } from '../../../utils/response.util';
import { HistoryTryoutService } from '../history-tryout/services';
import { excelHeaders, selection } from './constanta';

export class TryoutPackageService {
  private repository = AppDataSource.getRepository(TryoutPackageModel);
  private repoCategory = AppDataSource.getRepository(TryoutCategoryModel);

  private readonly historyService = new HistoryTryoutService();

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

  async excelImported(req: I_RequestCustom): Promise<I_ExpressResponse> {
    try {
      const resultExtract = await extractFileExcel(req, excelHeaders);

      if (!resultExtract.status) {
        return {
          success: resultExtract.status,
          code: 400,
          message: resultExtract.message,
          data: resultExtract.origin,
        };
      }

      const resultHistory = await this.historyService.create(req, {
        history_status: CS_StatusName.onProgress,
        history_type: CS_HistoryReportType.import.name,
        history_request: { files: req?.file, user: req?.user },
        history_description: CS_HistoryReportType.import.description('Paket Tryout'),
        created_at: resultExtract.origin.today,
        created_by: req?.user?.user_id,
      });

      if (!resultHistory?.success) {
        return resultHistory;
      }

      await executePublishHistoryTryout({
        origin: resultExtract.origin,
        history_id: resultHistory.data.history_id,
        type_name: CS_TypeName.TryoutPackage,
        request: req,
      });

      return {
        success: true,
        code: 200,
        message: MessageDialog.__('success.tryout-package.import'),
        data: resultHistory.data,
      };
    } catch (err: any) {
      return setupResponseMessage(false, err);
    }
  }

  async executeTryoutPackageImport(origin: any, history_id: string, req: I_RequestCustom): Promise<void> {
    const { columns, data, today } = origin;
    const rowLength: number = data?.length || 0;

    let meta: I_MetaHistory = {
      total_created: 0,
      total_row: rowLength,
      total_updated: 0,
      total_failed: 0,
      record: [],
      message: '',
    };

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (rowLength > 0) {
        for (let i = 0; i < rowLength; i++) {
          const element = data[i];
          let categoryId: any = null;

          const findCategory = await this.repoCategory.findOne({
            where: {
              deleted_at: IsNull(),
              name: element.category_name,
            },
          });

          if (!findCategory) {
            // Create New Category
            const resultCategory = await this.repoCategory.save(
              this.repoCategory.create({
                name: element.category_name,
                description: element.category_desc,
                created_at: today,
                created_by: req?.user?.user_id,
              }),
            );

            if (!resultCategory) {
              meta.total_failed += 1;
              meta.record.push({ ...element, message: 'Proses check kategori tryout gagal' });
              continue;
            } else {
              categoryId = resultCategory?.category_id;
            }
          } else {
            // Update Category
            categoryId = findCategory.category_id;
            const resultCategory = await this.repoCategory.save({
              ...findCategory,
              ...{
                name: element.category_name,
                description: element.category_desc,
                updated_at: today,
                updated_by: req?.user?.user_id,
              },
            });

            if (!resultCategory) {
              meta.total_failed += 1;
              meta.record.push({ ...element, message: 'Proses update kategori tryout gagal' });
              continue;
            }
          }

          const findPackage = await this.repository.findOne({
            where: {
              deleted_at: IsNull(),
              name: element.package_name,
              category_id: categoryId,
            },
          });

          if (findPackage) {
            // Update
            const resultPackage = await this.repository.save({
              ...findPackage,
              ...{
                name: element.package_name,
                description: element.package_desc,
                prices: element.package_price,
                updated_at: today,
                updated_by: req?.user?.user_id,
              },
            });

            if (!resultPackage) {
              meta.total_failed += 1;
              meta.record.push({ ...element, message: 'Proses update paket tryout gagal' });
              continue;
            } else {
              meta.total_updated += 1;
            }
          } else {
            // Create
            const resultPackage = await this.repository.save(
              this.repository.create({
                name: element.package_name,
                description: element.package_desc,
                prices: element.package_price,
                created_at: today,
                created_by: req?.user?.user_id,
                category_id: categoryId,
              }),
            );

            if (!resultPackage) {
              meta.total_failed += 1;
              meta.record.push({ ...element, message: 'Proses simpan paket tryout gagal' });
              continue;
            } else {
              meta.total_created += 1;
            }
          }
        }

        const totalOperated: number = meta.total_created + meta.total_updated;
        if (totalOperated == meta.total_row) {
          meta.message = `${meta.total_row} berhasil disimpan`;
        } else {
          meta.message = `${meta.total_failed} gagal disimpan`;
        }

        const resultHistory = await this.historyService.update(req, history_id, {
          history_status: CS_StatusName.done,
          history_response: meta,
          history_descriptio: meta.message,
        });

        if (!resultHistory.success) {
          await queryRunner.rollbackTransaction();
          Logger().error('Update data riwayat paket tryout gagal', resultHistory);
        } else {
          await queryRunner.commitTransaction();
          Logger().info(`Import data riwayat paket tryout (Riwayat ID : ${history_id}) berhasil`, resultHistory.data);
        }
      }
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      Logger().error(`Error execute import tryout package`, error);
    } finally {
      await queryRunner.release();
    }
  }

  async downloadTemplate(): Promise<I_ExpressResponse> {
    try {
      const results: Record<string, any>[] = [
        {
          package_name: 'SKD',
          package_desc: 'Seleksi Kompetensi Dasar',
          package_price: 2500,
          category_name: 'CPNS 2025',
          category_desc: 'Tryout Seleksi CPNS 2025',
        },
      ];

      return {
        success: true,
        message: MessageDialog.__('success.converter.downloadTemplate'),
        data: results,
        code: 200,
      };
    } catch (error: any) {
      return setupResponseMessage(false, error);
    }
  }
}
