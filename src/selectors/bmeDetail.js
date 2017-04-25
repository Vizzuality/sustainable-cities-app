import { createSelector } from 'reselect';

const getBmeDetail = bmes => bmes.list.find(bme => +bme.id === +bmes.detailId);

// Export the selector
export default createSelector(
  state => state.bmes,
  getBmeDetail,
);
