import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.TryoutPackages,
  package_name: 'package_name',
  category_id: SC.PrimaryKey.TryoutCategories,
  stage_id: SC.PrimaryKey.TryoutStages,
  total_questions: 'total_questions',
  order_number: 'order_number',
  mode_answer: 'mode_answer',
};

export const sortItem = {
  default: ['updated_at', 'DESC'],
  request: {
    category_name: 'category.name',
    package_name: 'package.package_name',
    stage_name: 'stage.stage_name',
    mode_answer: 'package.mode_answer',
    total_questions: 'package.total_questions',
    order_number: 'package.order_number',
    created_at: 'package.created_at',
    updated_at: 'package.updated_at',
  },
};

export const selection = {
  default: {
    package_id: true,
    package_name: true,
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
    total_questions: true,
    order_number: true,
    mode_answer: true,
    created_at: true,
    updated_at: true,
  },
};
