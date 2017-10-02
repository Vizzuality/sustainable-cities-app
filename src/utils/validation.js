import { required, email, passwordConfirmation, url } from 'constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required, email, passwordConfirmation, url });

export { validation }; // eslint-disable-line import/prefer-default-export
