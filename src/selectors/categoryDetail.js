import { createSelector } from 'reselect';

const getCategoryDetail = categories => categories.find(cat => +cat.id === +categories.detailId);

// Export the selector
export default createSelector(
  state => state.categories.all,
  getCategoryDetail
);
