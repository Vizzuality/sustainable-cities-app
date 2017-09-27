import { createSelector } from 'reselect';
import getTreeSolution from 'utils/solution';
import getBmeDetail from 'selectors/bmeDetail';

const solutionTreeSelectorBme = (solutions, bmeDetail) => {
  const bmeSolutions = ((bmeDetail || {}).categories || []).filter(category => category.category_type === 'Solution');
  if (!solutions.length || !bmeSolutions.length) return null;
  return bmeSolutions.map(bmeSolution => getTreeSolution(solutions, bmeSolution.id));
};

export default createSelector(
  state => state.categories.solution,
  state => getBmeDetail(state),
  solutionTreeSelectorBme
);
