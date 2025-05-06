export const sortRequest: Record<string, any> = {
  execute_time: 'execute_time',
  execute_status: 'execute_status',
  created_at: 'created_at',
};

export const sortDefault: string[] = [`created_at`, 'asc'];

export const excelHeaders: Record<string, any>[] = [{ slug: 'transaction', name: 'Form Data' }];

export const headersResult: Record<string, any>[] = [
  { header: 'Tax Invoice Number', key: 'tax_invoice_number', width: 20 },
  { header: 'Transaction Code', key: 'transaction_code', width: 20 },
  { header: 'Invoice Date', key: 'invoice_date', width: 15 },
  { header: 'Invoice Type', key: 'invoice_type', width: 15 },
  { header: 'Credit Period', key: 'credit_period', width: 15 },
  { header: 'Credit Year', key: 'credit_year', width: 15 },
  { header: 'Buyer TIN', key: 'buyer_tin', width: 20 },
  { header: 'Buyer Name', key: 'buyer_tax_name', width: 25 },
  { header: 'Buyer Email', key: 'buyer_tax_email', width: 25 },
  { header: 'Document ID', key: 'document_id', width: 20 },
  { header: 'Country', key: 'document_country', width: 15 },
  { header: 'Type', key: 'type', width: 15 },
  { header: 'Name', key: 'name', width: 25 },
  { header: 'Code', key: 'code', width: 15 },
  { header: 'Quantity', key: 'quantity', width: 10 },
  { header: 'Unit', key: 'unit', width: 10 },
  { header: 'Unit Price', key: 'unit_price', width: 15 },
  { header: 'Total Price', key: 'total_price', width: 15 },
  { header: 'Discount', key: 'discount', width: 15 },
  { header: 'VAT Rate', key: 'vat_rate', width: 10 },
  { header: 'Tax Base', key: 'tax_base', width: 15 },
  { header: 'Other Tax Check', key: 'other_tax_base_check', width: 15 },
  { header: 'Other Tax Base', key: 'other_tax_base', width: 15 },
  { header: 'VAT', key: 'vat', width: 15 },
  { header: 'STLG Rate', key: 'stlg_rate', width: 10 },
  { header: 'STLG', key: 'stlg', width: 15 },
];
