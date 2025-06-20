import { CS_DbSchema as SC } from '../../../constanta';

export const columns = {
  id: SC.PrimaryKey.TryoutDetails,
  type_id: 'type_id',
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
