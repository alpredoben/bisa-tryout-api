import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.Menu,
  parent_id: 'parent_id',
  name: 'name',
  icon: 'icon',
  slug: 'slug',
  order_number: 'order_number',
  is_sidebar: 'is_sidebar',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    slug: 'slug',
    order_number: 'order_number',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    user_id: true,
    name: true,
    email: true,
    phone: true,
    photo: true,
    role: {
      role_id: true,
      role_name: true,
      role_slug: true,
    },
    created_at: true,
    updated_at: true,
  },
};
