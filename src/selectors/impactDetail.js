import { createSelector } from 'reselect';

const getImpactDetail = impacts => impacts.list.find(impact => +impact.id === +impacts.detailId);

// Export the selector
export default createSelector(
  state => state.impacts,
  getImpactDetail
);
