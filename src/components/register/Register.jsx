import React from 'react';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Input, Button, Form } from 'components/form/Form';
import { dispatch } from 'main';
import { register } from 'modules/user';

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    dispatch(register(this.state, true));
  }

  @Autobind
  onInputChange(evt) {
    this.setState({
      [evt.target.name]: evt.target.value
    });
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
          <Input name="password_confirmation" type="password" onChange={this.onInputChange} value="" placeholder="Password confirmation" validations={['required']} />
          <Button className="c-btn -primary -centered">Register</Button>
        </Form>
      </section>
    );
  }
}

Register.propTypes = {

};
