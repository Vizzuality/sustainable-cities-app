import React from 'react';
import Validation from 'react-validation';
import ReactSelect from 'react-select';

const checkValidations = props => (props.validations || []).find(e => e === 'required');

const checkRequired = props => !!props.required;

function withWrapper(Component, requiredDecider) {
  return class extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      const { label, ...props } = this.props; // eslint-disable-line react/prop-types

      const required = requiredDecider(props);
      const suffix = required ? ' *' : '';

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
const Input = withWrapper(Validation.components.Input, checkValidations);
const Textarea = withWrapper(Validation.components.Textarea, checkValidations);
const Checkbox = withWrapper(Validation.components.Input, checkValidations);

const Select = withWrapper(ReactSelect, checkRequired);
const AsyncSelect = withWrapper(ReactSelect.Async, checkRequired);

export { Input, Button, Form, Textarea, Select, AsyncSelect, Checkbox };
