
export default function getTreeSolution(solutions = [], solutionId) {
  let parent = null;
  let children = null;
  let nephew = null;
  const solutionTree = {
    parent,
    children,
    nephew
  };

  if (!solutionId) return solutionTree;

  solutions.every((parentSolution) => {
    children = (((parentSolution.children || []).find(childrenSolution => +solutionId === +childrenSolution.id) || {}).id || null);

    (parentSolution.children || []).every((childrenSolution) => {
      nephew = (((childrenSolution.children || []).find(nephewSolution => +solutionId === +nephewSolution.id) || {}).id || null);

      // stop condition
      if (nephew) {
        parent = parentSolution.id;
        children = childrenSolution.id;

        return false;
      }

      return true;
    });

    // stop condition
    if (children) {
      parent = parentSolution.id;

      return false;
    }

    return true;
  });

  return {
    ...solutionTree,
    parent,
    children,
    nephew
  };
}
