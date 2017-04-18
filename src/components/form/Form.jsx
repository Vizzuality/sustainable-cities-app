import React from 'react';
import Validation from 'react-validation';

function withWrapper(Component) {
  return class extends React.Component {
    render() {
      return (
        <div className="form-control">
          <Component {...this.props} />
        </div>
      );
    }
  };
}

const Form = withWrapper(Validation.components.Form);
const Input = withWrapper(Validation.components.Input);
const Textarea = withWrapper(Validation.components.Textarea);
const Select = withWrapper(Validation.components.Select);
const Button = Validation.components.Button;

export { Input, Button, Form, Textarea, Select };
