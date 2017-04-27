import { createSelector } from 'reselect';

const getEnablingDetail = enablings => enablings.list.find(enabling => +enabling.id === +enablings.detailId);

// Export the selector
export default createSelector(
  state => state.enablings,
  getEnablingDetail
);
