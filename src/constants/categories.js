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

/* type selector */
const CATEGORY_TYPE_SELECT = [
  { label: 'Business Model Element (BME)', value: 'bme' },
  { label: 'Enabling Condition', value: 'enablings' },
  { label: 'Impact', value: 'impact' },
  { label: 'Solution', value: 'solution' },
  { label: 'Timing', value: 'timing' }
];

const CATEGORY_TYPE_CONVERSOR = [
  { key: 'bme', value: 'Bme' },
  { key: 'enablings', value: 'Enabling' },
  { key: 'impact', value: 'Impact' },
  { key: 'solution', value: 'Solution' },
  { key: 'timing', value: 'Timing' }
];

export {
  CATEGORY_TABLE_FIELDS,
  CATEGORY_TYPE_CONVERSOR,
  CATEGORY_TYPE_SELECT,
  DEFAULT_SORT_FIELD,
  NEW_CATEGORY_URL,
  EDIT_CATEGORY_URL
};
