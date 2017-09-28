/* table */
const DEFAULT_SORT_FIELD = 'name';
const CITY_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Province', value: 'province', sortable: true },
  { label: 'Country', value: 'country_name', sortable: true, sort: 'countries.name' }
];

// file management
const MAX_IMAGES_ACCEPTED = 1;
const MAX_SIZE_IMAGE = 1048576; // 1MB

export { DEFAULT_SORT_FIELD, CITY_TABLE_FIELDS, MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE };

