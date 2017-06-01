import { createSelector } from 'reselect';

const getStudyCaseDetail = (studyCases) => {
  return studyCases.list.find(sc => +sc.id === +studyCases.detailId);
};

// Export the selector
export default createSelector(
  state => state.studyCases,
  getStudyCaseDetail
);
