import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.TryoutPackages,
  name: 'name',
  description: 'description',
  prices: 'prices',
  category_id: 'category_id',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    description: 'description',
    prices: 'prices',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    package_id: true,
    name: true,
    description: true,
    prices: true,
    tryout_category: {
      category_id: true,
      name: true,
      description: true,
    },
    created_at: true,
    updated_at: true,
  },
};

export const excelHeaders = [
  {
    header: 'Nama Paket',
    key: 'package_name',
    width: 25,
  },
  {
    header: 'Keterangan',
    key: 'package_desc',
    width: 100,
  },
  {
    header: 'Harga Paket',
    key: 'package_price',
    width: 40,
  },
  {
    header: 'Kategori Paket',
    key: 'category_name',
    width: 40,
  },
  {
    header: 'Keterangan Kategori',
    key: 'category_desc',
    width: 100,
  },
];
