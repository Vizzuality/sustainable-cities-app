import { createSelector } from 'reselect';
import getTreeSolution from 'utils/solution';
// import getCategoryDetail from 'selectors/categoryDetail';

const solutionTreeSelectorCategory = (solutions, categoryDetail) => {
  if (!solutions.length || !Object.keys(categoryDetail || {}).length) return null;
  return getTreeSolution(solutions, categoryDetail.id);
};

export default createSelector(
  state => state.categories.solution,
  state => (state.categories.detail || [])[0],
  solutionTreeSelectorCategory
);
