function getIdRelations(relation, includes) {
  const relationIds = relation.map(cat => cat.id);
  const relationData = relationIds.map(cid => includes.find(inc => inc.id === cid));

  return relationData || [];
}

export { getIdRelations };
