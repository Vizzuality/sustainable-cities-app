import React from 'react';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Input, Button, Form } from 'components/form/Form';
import { dispatch } from 'main';
import { register } from 'modules/user';
import Spinner from 'components/ui/Spinner';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import capitalize from 'lodash/capitalize';

export default class Register extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillReceiveProps(newProps) {
    if (newProps.user.error && !isEqual(this.props.user.error, newProps.user.error)) {
      toastr.error(capitalize(newProps.user.error.errors[0].title));
    }
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    dispatch(register(this.form, true));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  render() {
    return (
      <section className="c-form -register">
        <h1 className="form-title h1">Register</h1>
        <Form onSubmit={this.onSubmit}>
          <Input name="email" type="Email" onChange={this.onInputChange} value="" placeholder="Email" validations={['required', 'email']} />
          <Input name="nickname" type="text" onChange={this.onInputChange} value="" placeholder="Nick name" validations={['required']} />
          <Input name="name" type="text" onChange={this.onInputChange} value="" placeholder="Name" validations={['required']} />
          <Input name="password" type="password" onChange={this.onInputChange} value="" placeholder="Password" validations={['required']} />
          <Input name="password_confirmation" type="password" onChange={this.onInputChange} value="" placeholder="Password confirmation" validations={['required', 'passwordConfirmation']} />
          <Button className="c-btn -primary -centered">Register</Button>
          <Spinner isLoading={this.props.user.loading} />
        </Form>
      </section>
    );
  }
}

Register.propTypes = {
  user: React.PropTypes.object
};
