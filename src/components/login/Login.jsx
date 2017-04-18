import React from 'react';
import { Input, Button, Form } from 'components/form/Form';
import Spinner from 'components/ui/Spinner';
import { login } from 'modules/user';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';
import { validation } from 'utils/validation';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import capitalize from 'lodash/capitalize';

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  /* Lifecycle */
  componentWillReceiveProps(newProps) {
    if (newProps.user.error && !isEqual(this.props.user.error, newProps.user.error)) {
      toastr.error(capitalize(newProps.user.error.errors[0].title));
    }
  }

  /* Methods  */
  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Login user
    dispatch(login(this.state));
  }

  @Autobind
  onInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  }

  render() {
    return (
      <section className="c-form -login">
        <h1 className="form-title h1">Login</h1>
        <Form className="login-form" onSubmit={this.onSubmit}>
          <Input type="email" onChange={this.onInputChange} name="email" value="" placeholder="Email" validations={['required', 'email']} />
          <Input type="password" onChange={this.onInputChange} name="password" value="" placeholder="Password" validations={['required']} />
          <Button className="c-btn -primary -centered">Login</Button>
          <Spinner isLoading={this.props.user.loading} />
        </Form>
      </section>
    );
  }
}

Login.propTypes = {
  user: React.PropTypes.object
};
