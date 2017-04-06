import React from 'react';
import { Input, Button, Form } from 'components/form/Form';
import { required, email } from 'constants/validation-rules';
import Spinner from 'components/ui/Spinner';
import { login } from 'modules/login';
import Validation from 'react-validation';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';

Object.assign(Validation.rules, { required, email });

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    // Login user
    dispatch(
      login({
        email: this.state.email,
        password: this.state.password
      })
    );
  }

  @Autobind
  onInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    return (
      <section className="c-login">
        <h1 className="login-title h1">Login</h1>
        {this.props.login.error &&
          <span className="login-error">{this.props.login.error.errors[0].title}</span>
        }
        <Form className="login-form" onSubmit={this.onSubmit}>
          <Input type="text" onChange={this.onInputChange} name="email" value="" placeholder="Email" validations={['required', 'email']} />
          <Input type="password" onChange={this.onInputChange} name="password" value="" placeholder="Password" validations={['required']} />
          <Button className="c-btn -primary -centered">Login</Button>
          <Spinner isLoading={this.props.login.loading} />
        </Form>
      </section>
    );
  }
}

Login.propTypes = {
  login: React.PropTypes.object
};
