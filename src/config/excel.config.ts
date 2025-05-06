import ExcelJs from 'exceljs';
import { Response } from 'express';
import { I_ExcelOriginInterface, I_GenerateExcelParams, I_RequestCustom } from '../interfaces/app.interface';
import { MessageDialog } from '../lang';
import { standartDateISO } from '../utils/common.util';
import { sendErrorResponse } from '../utils/response.util';

import path from 'path';

/** Generate File Excel */
export const makeFileExcel = async (res: Response, option: I_GenerateExcelParams): Promise<Response> => {
  try {
    const workBook = new ExcelJs.Workbook();
    const workSheet = workBook.addWorksheet(option.sheetName);

    // Set headers (Table Column)
    workSheet.addRow(option.headers);

    option?.data?.forEach((item: any) => {
      workSheet.addRow(Object.values(item));
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${option.fileName}.xlsx`);

    await workBook.xlsx.write(res);

    return res.status(200).end();
  } catch (error: any) {
    return sendErrorResponse(res, 400, MessageDialog.__('error.download.xlsx'), error);
  }
};

export const generateFileExcel = async (
  id: string,
  sheetName: string,
  data: Record<string, any>[] | any[],
  headers: any[],
): Promise<Record<string, any>> => {
  const workbook = new ExcelJs.Workbook();
  const worksheet = workbook.addWorksheet(sheetName);

  worksheet.columns = headers;

  worksheet.addRows(data);

  const fileName: string = `transactions_${id || 'unknown'}`;

  // Save the file
  const filePath = path.join(__dirname, `../../public/excel/${fileName}.xlsx`);
  await workbook.xlsx.writeFile(filePath);

  return {
    success: true,
    file_path: filePath,
    file_name: fileName,
  };
};

interface I_ObjectRaw {
  [key: string]: any;
}

/** Extract file Excel */
export const extractFileExcel = async (
  req: I_RequestCustom,
  propHeaders: Record<string, any>[],
): Promise<I_ExcelOriginInterface> => {
  const userId: any = req?.user?.user_id;
  const file: Buffer | any = req?.file?.buffer;

  try {
    const rowData: I_ObjectRaw[] = [];
    const rowColumns: string[] = [];

    const workBook = new ExcelJs.Workbook();
    const loadWorkbook = await workBook.xlsx.load(file);

    if (!loadWorkbook) {
      return {
        status: false,
        origin: null,
        created_by: userId,
        message: MessageDialog.__('error.failed.loadFileStream', { type: 'excel' }),
      };
    }

    const workSheet = workBook.worksheets[0];

    workSheet.eachRow((rows: any, rowNumber: number) => {
      if (rowNumber === 1) {
        // Headers
        rows.eachCell((_cell: any, colNumber: number) => {
          rowColumns[colNumber - 1] = propHeaders[colNumber - 1].slug;
        });
      } else {
        // Row Data
        const objectRaw: I_ObjectRaw = {};
        rows.eachCell((cell: { text: any }, colNumber: number) => {
          objectRaw[rowColumns[colNumber - 1]] = cell.text;
        });

        rowData.push(objectRaw);
      }
    });

    if (rowData?.length <= 0) {
      return {
        status: false,
        origin: rowData,
        created_by: userId,
        message: MessageDialog.__('error.default.emptyDataFile'),
      };
    }

    return {
      status: true,
      origin: {
        columns: rowColumns,
        data: rowData,
        today: new Date(standartDateISO()),
        created_by: userId,
      },
      created_by: userId,
      message: MessageDialog.__('success.extractFile.read'),
    };
  } catch (error: any) {
    return {
      status: false,
      origin: error,
      created_by: userId,
      message: MessageDialog.__('error.failed.readFileStream', { type: 'excel' }),
    };
  }
};
