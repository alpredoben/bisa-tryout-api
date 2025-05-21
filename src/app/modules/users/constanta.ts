import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.User,
  role_id: 'role_id',
  name: 'name',
  email: 'email',
  password: 'password',
  phone: 'phone',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    email: 'email',
    role_name: 'role.role_name',
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
