import React from 'react';
import { Input, Button, Form } from 'components/form/Form';
import { required, email } from 'constants/validation-rules';
import Validation from 'react-validation';

Object.assign(Validation.rules, { required, email });

export default class Login extends React.Component {

  constructor(props) {
    super(props);

    // Bindings
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(evt) {
    evt.preventDefault();
    // TODO: login with api
  }

  render() {
    return (
      <section className="c-login">
        <h1 className="login-title h1">Login</h1>
        <Form className="login-form" onSubmit={this.onSubmit}>
          <Input type="text" name="email" value="" placeholder="Email" validations={['required', 'email']} />
          <Input type="password" name="password" value="" placeholder="Password" validations={['required']} />
          <Button className="c-btn -primary -centered">Login</Button>
        </Form>
      </section>
    );
  }
}
