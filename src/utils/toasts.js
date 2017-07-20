import { toastr } from 'react-redux-toastr';

export default {};

export const xhrErrorToast = ({ errors } = { errors: [] }) => {
  toastr.error(['Problem saving data! '].concat(
    Object.entries(errors[0])
      .filter(([k]) => k !== 'status')
      .map(([k, v]) => [k, v].join(' '))
      .join('\n')
  ));
};
