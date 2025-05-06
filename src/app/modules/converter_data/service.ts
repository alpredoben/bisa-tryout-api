import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { makeFileExcel } from '../../../config/excel.config';
import { formatDateToday, standartDateISO } from '../../../utils/common.util';
import { defineRequestOrderORM, defineRequestPaginateArgs } from '../../../utils/request.util';
import { sendErrorResponse, sendSuccessResponse } from '../../../utils/response.util';
import { excelHeaders, sortDefault, sortRequest } from './constanta';
import { ConverterDataRepository } from './repository';

class ConverterDataService {
  private readonly repository = new ConverterDataRepository();

  async fetch(req: Request, res: Response): Promise<Response> {
    const filters: Record<string, any> = {
      paging: defineRequestPaginateArgs(req),
      sorting: defineRequestOrderORM(req, sortDefault, sortRequest),
    };

    const result = await this.repository.fetch(filters);
    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.data);
    }

    return sendSuccessResponse(res, 200, result.message, result.data);
  }

  async excelImported(req: Request, res: Response): Promise<Response> {
    const result = await this.repository.excelImported(req);
    return sendErrorResponse(res, result.code, result.message, result.data);
  }

  async downloadReport(req: Request, res: Response): Promise<Response> {
    const result = await this.repository.downloadTemplateExcel();

    if (!result?.success) {
      return sendErrorResponse(res, 400, result.message, result.data);
    }

    const fileName = `Template_Transaction_${formatDateToday('YYYYMMDDHHmmss', new Date(standartDateISO()))}`;
    const headers = excelHeaders.map((x: any) => x.name);
    return await makeFileExcel(res, {
      fileName,
      headers,
      data: result.data,
      sheetName: 'Data Transaksi',
    });
  }

  async checkImport(req: Request, res: Response): Promise<Response> {
    const result = await this.repository.checkImport(req);
    return sendErrorResponse(res, result.code, result.message, result.data);
  }

  async downloadTransaction(req: Request, res: Response): Promise<void> {
    const id: string = req?.params?.history_id;
    const result = await this.repository.downloadTransaction(id);

    if (!result?.success) {
      sendErrorResponse(res, result.code, result.message, result.data);
      return;
    }

    console.log({ RESULTS: result });

    if (!fs.existsSync(result.data.path_file)) {
      res.status(404).json({ message: 'Excel file not found.' });
      return;
    }

    res.download(result.data.path_file, path.basename(result.data.path_file), (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).send('Failed to download file.');
      }

      // Optional: Clean up file after sending
      fs.unlink(result.data.path_file, (unlinkErr) => {
        if (unlinkErr) console.error('Failed to delete temp file:', unlinkErr);
      });
    });
  }
}

export default new ConverterDataService();
