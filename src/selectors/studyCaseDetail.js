import { createSelector } from 'reselect';

const getStudyCaseDetail = (studyCases) => {
  let studyCase = studyCases.list.find(sc => +sc.id === +studyCases.detailId);
  if (studyCase) {
    studyCase = {
      ...studyCase,
      ...{ included: studyCases.included }
    };
  }
  return studyCase;
};

// Export the selector
export default createSelector(
  state => state.studyCases,
  getStudyCaseDetail
);
