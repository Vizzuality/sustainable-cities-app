import { createSelector } from 'reselect';

const getSolutionDetail = solutions => solutions.list.find(solution => +solution.id === +solutions.detailId);

// Export the selector
export default createSelector(
  state => state.solutions,
  getSolutionDetail
);
