/* table */
const DEFAULT_SORT_FIELD = 'name';
const SOURCES_TABLE_FIELDS = [
  { label: 'Name', value: 'name', sortable: true },
  { label: 'Type', value: 'type', sortable: true }
];

/* selector */
const SOURCE_TYPE_OPTIONS = [
  { label: 'Website', value: 'website' },
  { label: 'Blog', value: 'blog' },
  { label: 'File', value: 'file' }
];

export { DEFAULT_SORT_FIELD, SOURCES_TABLE_FIELDS, SOURCE_TYPE_OPTIONS };
