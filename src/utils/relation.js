function getIdRelations(relation, includes, type) {
  const relationIds = relation.map(cat => cat.id);
  const relationData = relationIds.map((cid) => {
    return includes.find(inc => inc.id === cid && inc.type === type);
  });
  return relationData || [];
}

export { getIdRelations }; // eslint-disable-line import/prefer-default-export
