import { CS_DbSchema as SC } from '../../../constanta';

export const columns = {
  id: SC.PrimaryKey.TryoutPackageDetails,
  name: 'name',
  description: 'description',
  total_questions: 'total_questions',
  total_duration: 'total_duration',
  order_number: 'order_number',
  passing_grade: 'passing_grade',
  package_id: 'package_id',
  created_at: 'created_at',
};

export const sortItem = {
  default: ['created_at', 'DESC'],
  request: {
    name: 'name',
    description: 'description',
    total_questions: 'total_questions',
    passing_grade: 'passing_grade',
    created_at: 'created_at',
  },
};

export const selection = {
  default: {
    package_detail_id: true,
    name: true,
    description: true,
    passing_grade: true,
    total_questions: true,
    total_duration: true,
    order_number: true,
    tryout_package: {
      package_id: true,
      name: true,
      description: true,
      tryout_category: {
        category_id: true,
        name: true,
      },
    },
    created_at: true,
    updated_at: true,
  },
};
