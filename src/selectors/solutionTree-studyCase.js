import { createSelector } from 'reselect';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import getTreeSolution from 'utils/solution';

const solutionTreeSelectorStudyCase = (solutions, studyCaseDetail) => {
  if (!solutions.length || !Object.keys(studyCaseDetail).length) return null;
  const { category_id } = studyCaseDetail || {};
  return getTreeSolution(solutions, category_id);
};

export default createSelector(
  state => state.categories.solution,
  state => getStudyCaseDetail(state),
  solutionTreeSelectorStudyCase
);
