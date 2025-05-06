import { headersResult } from '../../app/modules/converter_data/constanta';
import AppDataSource from '../../config/db.config';
import { generateFileExcel } from '../../config/excel.config';
import { subscribeMessage } from '../../config/rabbitmq.config';
import { CS_MessageBroker } from '../../constanta';
import { formatDateToday, standartDateISO } from '../../utils/common.util';

import { HistoryImportTransaction } from '../../database/models/HistoryImportTransaction';

const { Queue, Exchange } = CS_MessageBroker;

interface I_TransactionFormat {
  tax_invoice_number?: string;
  transaction_code?: string;
  invoice_date?: Date;
  invoice_type?: string;
  credit_period?: string;
  credit_year?: string;
  buyer_tin?: string;
  buyer_tax_name?: string;
  buyer_tax_email?: string;
  document_id?: string;
  document_country?: string;
  type?: string;
  name?: string;
  code?: string;
  quantity?: number;
  unit?: string;
  unit_price?: number;
  total_price?: number;
  discount?: number;
  vat_rate?: number;
  tax_base?: number;
  other_tax_base_check?: boolean;
  other_tax_base?: number;
  vat?: number;
  stlg_rate?: number;
  stlg?: number;
}

const extractDataAndImportToExcel = async (exchangeName: string, queueName: string, message: string): Promise<void> => {
  const repository = AppDataSource.getRepository(HistoryImportTransaction);
  const { origin, history_id } = JSON.parse(message);
  const { columns, data, today } = origin;
  let description: Record<string, any> = {
    total_created: 0,
    total_row: 0,
    total_updated: 0,
    total_failed: 0,
    message: '',
  };

  try {
    const rowLength: number = data?.length ? data.length : 0;
    if (rowLength > 0) {
      description.total_row = rowLength;

      const rows: I_TransactionFormat[] = [];

      for (let i = 0; i < rowLength; i++) {
        const { transaction } = data[i];
        const element = JSON.parse(transaction);

        const detailLength: number = element?.TransactionDetailsData?.Rows?.length;

        description.total_created += detailLength;

        if (detailLength > 0) {
          for (let j = 0; j < element.TransactionDetailsData.Rows.length; j++) {
            const trx = element.TransactionDetailsData.Rows[j];

            let item: I_TransactionFormat = {
              tax_invoice_number: element.TransactionDocumentData.TaxInvoiceNumber,
              transaction_code: element.TransactionDocumentData.TransactionCode,
              invoice_date: new Date(formatDateToday('YYYY-MM-DD', element.TransactionDocumentData.InvoiceDate)),
              invoice_type: element.TransactionDocumentData.InvoiceType,
              credit_period: element.TransactionDocumentData.PeriodCredit,
              credit_year: element.TransactionDocumentData.YearCredit,
              buyer_tin: element.BuyerInformationData.BuyerTIN,
              buyer_tax_name: element.BuyerInformationData.BuyerTaxpayerNameInClear,
              buyer_tax_email: element.BuyerInformationData.BuyerTaxpayerEmail,
              document_id: element.BuyerInformationData.IDDocument,
              document_country: element.BuyerInformationData.IDDocumentCountry,
              type: trx.Type,
              name: trx.Name,
              code: trx.Code,
              quantity: trx.Quantity,
              unit: trx.Unit,
              unit_price: trx.UnitPrice,
              total_price: trx.TotalPrice,
              discount: trx.Discount,
              vat_rate: trx.VATRate,
              tax_base: trx.TaxBase,
              other_tax_base_check: trx.OtherTaxBaseCheck,
              other_tax_base: trx.OtherTaxBase,
              vat: trx.VAT,
              stlg_rate: trx.STLGRate,
              stlg: trx.STLG,
            };

            rows.push(item);
          }
        }
      }

      const rowHistory = await repository.findOne({ where: { history_id } });

      if (rowHistory) {
        const result = await generateFileExcel(history_id, 'Transaction', rows, headersResult);

        if (result?.success == true) {
          await repository.save({
            ...rowHistory,
            description: JSON.stringify(description),
            path_file: result.file_path,
            file_name: result.file_name,
            execute_status: 'success',
            updated_at: standartDateISO(),
          });
        } else {
          await repository.save({
            ...rowHistory,
            description: JSON.stringify({
              total_created: 0,
              total_row: 0,
              total_updated: 0,
              total_failed: 0,
              message: 'Failede',
            }),
            execute_status: 'failed',
            updated_at: standartDateISO(),
          });
        }
      }
    }
  } catch (error: any) {
    console.log({ ERROR_RESULT: error });
  }
};

export const eventSubscribeTransaction = async (): Promise<void> => {
  const queue: string = Queue.Transaction;
  const exchange: string = Exchange.Transaction;

  console.info(`Now System checking exchange and queue (${exchange}, ${queue}) response from broker`);

  try {
    await subscribeMessage(exchange, queue, extractDataAndImportToExcel);
  } catch (err: any) {
    console.info(`Error response checking exchange and queue (${exchange}, ${queue}) : `, err);
  }
};
