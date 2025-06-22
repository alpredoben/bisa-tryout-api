import { CS_DbSchema as SC } from '../../../constanta';

export const columns = {
  id: SC.PrimaryKey.TryoutDetails,
  package_id: SC.PrimaryKey.TryoutPackages,
  type_id: SC.PrimaryKey.TryoutTypes,
  description: 'description',
  total_questions: 'total_questions',
  total_duration: 'total_duration',
  satuan_duration: 'satuan_duration',
  order_number: 'order_number',
  passing_grade: 'passing_grade',
  mode_answer: 'mode_answer',
  created_at: 'created_at',
  updated_at: 'updated_at',
};

export const sortItem = {
  default: ['updated_at', 'DESC'],
  request: {
    name: 'name',
    total_questions: 'detail.total_questions',
    passing_grade: 'detail.passing_grade',
    mode_answer: 'detail.mode_answer',
    package_name: 'package.package_name',
    type_name: 'type.name',
    created_at: 'detail.created_at',
    updated_at: 'detail.updated_at',
  },
};
