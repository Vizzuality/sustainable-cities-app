function getIdRelations(relation, includes, type) {
  const relationIds = relation.map(cat => cat.id);
  const relationData = relationIds.map(cid => includes.find(inc => inc.id === cid && inc.type === type));
  return relationData || [];
}

export { getIdRelations };
