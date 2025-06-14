import { CS_DbSchema as SC } from '../../../constanta';
export const columns = {
  id: SC.PrimaryKey.HistoryReportTryout,
  history_status: 'history_status',
  history_type: 'history_type',
  history_description: 'history_description',
  history_response: 'history_response',
  history_request: 'history_request',
};

export const sortItem = {
  default: ['updated_at', 'DESC'],
  request: {
    history_status: 'history_status',
    history_type: 'history_type',
    history_description: 'history_description',
    updated_at: 'updated_at',
  },
};
