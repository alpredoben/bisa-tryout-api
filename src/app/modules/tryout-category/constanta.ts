import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.TryoutCategories,
  organization_id: SC.PrimaryKey.Organizations,
  name: 'name',
  description: 'description',
  year: 'year',
  prices: 'prices',
};

export const sortItem = {
  default: ['tryout_category.updated_at', 'DESC'],
  request: {
    name: 'tryout_category.name',
    description: 'tryout_category.description',
    organization_name: 'organization.name',
    organization_icon: 'organization.icon',
    year: 'tryout_category.year',
    prices: 'tryout_category.prices',
    created_at: 'tryout_category.created_at',
    updated_at: 'tryout_category.updated_at',
  },
};

export const selection = {
  default: {
    [columns.id]: true,
    name: true,
    description: true,
    year: true,
    prices: true,
    organization: {
      organization_id: true,
      name: true,
      description: true,
      icon: true,
    },
    created_at: true,
    updated_at: true,
  },
};
