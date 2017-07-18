import React from 'react';
import Validation from 'react-validation';
import ReactSelect from 'react-select';

function withWrapper(Component) {
  return class extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      const { label, ...props } = this.props; // eslint-disable-line react/prop-types

      const required = (props.validations || []).find(e => e === 'required');
      const suffix = required ? ' *': '';

      return (
        <div className="form-control">
          {label && <label htmlFor={props.name} >{label}{suffix}</label>}
          <Component id={props.name} {...props} />
        </div>
      );
    }
  };
}

const Form = Validation.components.Form;
const Button = Validation.components.Button;
const Input = withWrapper(Validation.components.Input);
const Textarea = withWrapper(Validation.components.Textarea);
const Select = withWrapper(ReactSelect);
const AsyncSelect = withWrapper(ReactSelect.Async);
const Checkbox = withWrapper(Validation.components.Input);

export { Input, Button, Form, Textarea, Select, AsyncSelect , Checkbox};
