/* table */
const CATEGORY_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Type', value: 'category_type', sortable: true },
  { label: 'Description', value: 'description' }
];
const DEFAULT_SORT_FIELD = 'name';

/* table – URL's */
const NEW_CATEGORY_URL = '/category/new';
const EDIT_CATEGORY_URL = '/category/edit';

export { CATEGORY_TABLE_FIELDS, DEFAULT_SORT_FIELD, NEW_CATEGORY_URL, EDIT_CATEGORY_URL };
