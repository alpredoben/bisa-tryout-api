import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.Permission,
  name: 'name',
  order_number: 'order_number',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    order_number: 'order_number',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    permission_id: true,
    name: true,
    order_number: true,
    created_at: true,
    updated_at: true,
  },
};
