import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.Role,
  role_name: 'role_name',
  role_slug: 'role_slug',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    role_name: 'role_name',
    role_slug: 'role_slug',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    role_id: true,
    role_name: true,
    role_slug: true,
    created_at: true,
    updated_at: true,
  },
};
