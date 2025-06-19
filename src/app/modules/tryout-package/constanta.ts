import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.TryoutTypes,
  category_id: SC.PrimaryKey.TryoutCategories,
  stage_id: SC.PrimaryKey.TryoutStages,
  total_questions: 'total_questions',
  order_number: 'order_number',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    category_name: 'category_name',
    stage_name: 'stage_name',
    category_prices: 'category_prices',
    category_year: 'category_year',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    package_id: true,
    category: {
      category_id: true,
      name: true,
      description: true,
      prices: true,
      year: true,
    },
    stage: {
      stage_id: true,
      name: true,
      description: true,
    },
    created_at: true,
    updated_at: true,
  },
};
