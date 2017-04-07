import { required, email } from 'constants/validation-rules';
import Validation from 'react-validation';

const validation = Object.assign(Validation.rules, { required, email });

export { validation };
