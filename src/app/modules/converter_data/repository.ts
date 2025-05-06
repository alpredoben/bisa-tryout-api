import { Request } from 'express';
import { ILike, IsNull } from 'typeorm';
import AppDataSource from '../../../config/db.config';
import { extractFileExcel } from '../../../config/excel.config';
import { HistoryImportTransaction } from '../../../database/models/HistoryImportTransaction';
import { executeTransaction } from '../../../events/publishers/transaction.publisher';
import { I_ExpressResponse } from '../../../interfaces/app.interface';
import { I_ResponsePagination } from '../../../interfaces/pagination.interface';
import { MessageDialog } from '../../../lang';
import { setupResponseMessage } from '../../../utils/helper.util';
import { setPagination } from '../../../utils/pagination.util';
import { excelHeaders } from './constanta';

export class ConverterDataRepository {
  private repository = AppDataSource.getRepository(HistoryImportTransaction);

  async fetch(filters: Record<string, any>): Promise<I_ExpressResponse> {
    try {
      const { paging, sorting } = filters;
      let whereConditions: Record<string, any>[] = [];

      if (paging?.search && paging?.search != '' && paging?.search != null) {
        const searchTerm: string = paging?.search;
        whereConditions = [{ filename: ILike(`%${searchTerm}%`), deleted_at: IsNull() }];
      }

      let [rows, count] = await this.repository.findAndCount({
        where: whereConditions,
        skip: paging?.skip,
        take: paging?.limit,
        order: sorting,
      });

      const pagination: I_ResponsePagination = setPagination(rows, count, paging.page, paging.limit);

      return {
        success: true,
        code: 200,
        message: 'Berhasil mendapatkan data',
        data: pagination,
      };
    } catch (err: any) {
      return setupResponseMessage(false, err);
    }
  }

  async excelImported(req: Request): Promise<I_ExpressResponse> {
    try {
      const resultExtract = await extractFileExcel(req, excelHeaders);
      if (!resultExtract.status) {
        return setupResponseMessage(false, resultExtract.origin, resultExtract.message, 400);
      }

      const rowHistory = await this.repository.save(
        this.repository.create({
          description: JSON.stringify({
            total_created: 0,
            total_row: 0,
            total_updated: 0,
            total_failed: 0,
            message: 'Waiting on background proccess integration',
          }),
          execute_time: resultExtract.origin.today,
          created_at: resultExtract.origin.today,
          updated_at: resultExtract.origin.today,
        }),
      );

      if (!rowHistory) {
        return setupResponseMessage(false, rowHistory, MessageDialog.__('error.converter.storeHistory'), 400);
      }

      await executeTransaction({
        origin: resultExtract.origin,
        history_id: rowHistory.history_id,
      });

      return setupResponseMessage(
        true,
        resultExtract.origin?.data,
        MessageDialog.__('success.converter.importExcel'),
        200,
      );
    } catch (err: any) {
      return setupResponseMessage(false, err);
    }
  }

  async downloadTemplateExcel(): Promise<I_ExpressResponse> {
    try {
      const results: Record<string, any>[] = [
        {
          transaction: {
            TransactionDocumentData: {
              DownPayment: false,
              RestOfPayment: false,
              TaxInvoiceNumber: '04002500101903424',
              TransactionCode: 'TD.00304',
              TransactionType: null,
              DocumentNumber: null,
              DocumentDate: null,
              InvoiceDate: '2025-04-11T00:00:00',
              InvoiceType: 'TD.00400',
              AdditionalInformation: '',
              Period: 'TD.00704',
              Year: '2025',
              CustomDocument: '',
              Reference: '0147/IV/25',
              FacilityStamp: '',
              PlaceOfBusinessActivity: '0020375424211000000000',
              SP2DNumber: null,
              SellerAddress: 'JL LINTAS TIMUR KM 18 , RT 002, RW 011, RIAU, KOTA PEKANBARU, KULIM, KULIM, 28243',
              PeriodCredit: null,
              YearCredit: null,
              ContractDuration: null,
            },
            BuyerInformationData: {
              BuyerTIN: '0021801832125000',
              IDDocument: 'BY.00204',
              IDDocumentCountry: 'IDN',
              IDDocumentNumber: '-',
              BuyerTaxpayerName: 'SINAR******',
              BuyerTaxpayerNameInClear: 'SINAR INTAN PERKASA',
              BuyerTaxpayerAddress:
                'JALAN BINTANG TERANG DUSUN XV NO.184 A, RT 000, RW 000, SUMATERA UTARA, KAB. DELI SERDANG, SUNGGAL, MULIO REJO, 20352',
              BuyerTaxpayerEmail: 'sinarintanperkasa125@gmail.com',
              BussinessCode: '0021801832125000000000',
            },
            TransactionDetailsData: {
              Rows: [
                {
                  Type: 'GOODS',
                  Name: 'SHEET DIRELL 805 x 1090 MM DW',
                  Code: '000000',
                  Quantity: 2735,
                  Unit: 'UM.0021',
                  UnitPrice: 7880,
                  TotalPrice: 21551800,
                  Discount: 0,
                  VATRate: 0.12,
                  TaxBase: 21551800,
                  OtherTaxBaseCheck: true,
                  OtherTaxBase: 19755816.67,
                  VAT: 2370698,
                  STLGRate: 0,
                  STLG: 0,
                },
                {
                  Type: 'GOODS',
                  Name: 'SHEET DIRELL 781 x 1070 MM DW',
                  Code: '000000',
                  Quantity: 2709,
                  Unit: 'UM.0021',
                  UnitPrice: 7740,
                  TotalPrice: 20967660,
                  Discount: 0,
                  VATRate: 0.12,
                  TaxBase: 20967660,
                  OtherTaxBaseCheck: true,
                  OtherTaxBase: 19220355,
                  VAT: 2306442.6,
                  STLGRate: 0,
                  STLG: 0,
                },
                {
                  Type: 'GOODS',
                  Name: 'SHEET DIRELL 789 x 1074 MM DW',
                  Code: '000000',
                  Quantity: 921,
                  Unit: 'UM.0021',
                  UnitPrice: 7770,
                  TotalPrice: 7156170,
                  Discount: 0,
                  VATRate: 0.12,
                  TaxBase: 7156170,
                  OtherTaxBaseCheck: true,
                  OtherTaxBase: 6559822.5,
                  VAT: 787178.9,
                  STLGRate: 0,
                  STLG: 0,
                },
                {
                  Type: 'GOODS',
                  Name: 'SHEET BERSIH 789 x 1074 MM DW',
                  Code: '000000',
                  Quantity: 1305,
                  Unit: 'UM.0021',
                  UnitPrice: 7770,
                  TotalPrice: 10139850,
                  Discount: 0,
                  VATRate: 0.12,
                  TaxBase: 10139850,
                  OtherTaxBaseCheck: true,
                  OtherTaxBase: 9294862.5,
                  VAT: 1115383.5,
                  STLGRate: 0,
                  STLG: 0,
                },
                {
                  Type: 'GOODS',
                  Name: 'SHEET DIRELL 765 x 1054 MM DW',
                  Code: '000000',
                  Quantity: 915,
                  Unit: 'UM.0021',
                  UnitPrice: 7620,
                  TotalPrice: 6972300,
                  Discount: 0,
                  VATRate: 0.12,
                  TaxBase: 6972300,
                  OtherTaxBaseCheck: true,
                  OtherTaxBase: 6391275,
                  VAT: 766953,
                  STLGRate: 0,
                  STLG: 0,
                },
              ],
              FooterRow: {
                TotalPrice: 66787780,
                TotalDiscount: 0,
                TaxBaseTotal: 66787780,
                OtherTaxBaseTotal: 61222132,
                VATTotal: 7346656,
                STLGTotal: 0,
                DownPayment: 0,
                TotalDownpaymentSum: 0,
                RestOfPayment: 0,
                TaxBase: 66787780,
                OtherTaxBase: 61222132,
                STLG: 0,
                VAT: 7346656,
                DownpaymentHistories: [],
              },
            },
            IsDraft: true,
            IsMigrated: false,
          },
        },
      ];

      return setupResponseMessage(true, results, MessageDialog.__('success.converter.downloadTemplate'), 200);
    } catch (error: any) {
      return setupResponseMessage(false, error);
    }
  }

  async checkImport(req: Request): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        order: {
          updated_at: 'DESC',
        },
      });

      return setupResponseMessage(true, result, MessageDialog.__('success.converter.checkHistory'), 200);
    } catch (err: any) {
      return setupResponseMessage(false, err);
    }
  }

  async downloadTransaction(id: string): Promise<I_ExpressResponse> {
    try {
      const result = await this.repository.findOne({
        where: {
          history_id: id,
        },
      });

      return setupResponseMessage(true, result, MessageDialog.__('success.converter.checkHistory'), 200);
    } catch (err: any) {
      return setupResponseMessage(false, err);
    }
  }
}
