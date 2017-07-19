export function getIdRelations(relation, includes, type) {
  return relation.map(obj => includes.find(inc => inc.id === obj.id && inc.type === type));
}

export function joinWithCategories(list, categories) {
  return list.map((obj) => {
    if (!obj.relationships.category.data) return obj;

    const category = getIdRelations(
      [obj.relationships.category.data],
      categories,
      'categories'
    );

    return {
      ...obj,
      category: category[0] ? category[0].name : '-'
    };
  });
}
