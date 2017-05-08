import { createSelector } from 'reselect';

const getSourceDetail = sources => sources.list.find(source => +source.id === +sources.detailId);

// Export the selector
export default createSelector(
  state => state.sources,
  getSourceDetail
);
