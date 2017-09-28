/* table */
const DEFAULT_SORT_FIELD = 'name';
const CITY_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Province', value: 'province', sortable: true },
  { label: 'Country', value: 'country_name', sortable: true, sort: 'countries.name' }
];

export { DEFAULT_SORT_FIELD, CITY_TABLE_FIELDS };
