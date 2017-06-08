import { required, email, passwordConfirmation } from 'constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required, email, passwordConfirmation });

export { validation }; // eslint-disable-line import/prefer-default-export
