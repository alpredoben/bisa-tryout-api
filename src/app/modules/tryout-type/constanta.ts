import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.TryoutTypes,
  name: 'name',
  description: 'description',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    description: 'description',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    [SC.PrimaryKey.TryoutTypes]: true,
    name: true,
    description: true,
    created_at: true,
    updated_at: true,
  },
};
