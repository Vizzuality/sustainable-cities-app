import React from 'react';
import { AsyncSelect } from 'components/form/Form';
import { get } from 'utils/request';
import debounce from 'lodash/debounce';

function getCities(input, cb) {
  if (!input.length) {
    cb();
    return;
  }

  get({
    url: `${config.API_URL}/cities?page[number]=1&&page[size]=50sort=name&search=${input.toLowerCase()}`,
    onSuccess({ data }) {
      const options = data.map(c => ({ value: c.id, label: `${c.attributes.name} (${c.attributes.iso})` }));
      cb(null, { options });
    }
  });
}

export default function CitySearch(props) {
  return (
    <AsyncSelect
      loadOptions={debounce(getCities, 300)}
      noResultsText="Sorry, there's no city that matches that name"
      {...props}
    />
  );
}
