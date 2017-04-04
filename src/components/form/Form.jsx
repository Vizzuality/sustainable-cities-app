import React from 'react';
import Validation from 'react-validation';

function withWrapper(Component) {
  return class extends React.Component {
    render() {
      const { children, ...props} = this.props;
      return (
        <div className="form-control">
          <Component {...props}>{children}</Component>
        </div>
      );
    }
  };
}

const Form = withWrapper(Validation.components.Form);
const Input = withWrapper(Validation.components.Input);
const Button = withWrapper(Validation.components.Button);

export { Input, Button, Form };
