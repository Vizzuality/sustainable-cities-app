/* table */
const DEFAULT_SORT_FIELD = 'name';
const BME_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Category', value: 'category', sortable: true },
  { label: 'Description', value: 'description' }
];

const MAX_SIZE_IMAGE = 1048576; // 1MB
const MAX_IMAGES_ACCEPTED = 1;

export { DEFAULT_SORT_FIELD, BME_TABLE_FIELDS, MAX_SIZE_IMAGE, MAX_IMAGES_ACCEPTED };
