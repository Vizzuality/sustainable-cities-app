import React from 'react';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { createBme } from 'modules/bmes';
import { Input, Button, Form, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';

export default class NewBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.categories.list.length || dispatch(getCategories());
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Create Bme
    dispatch(createBme({
      data: this.form,
      onSuccess() {
        toastr.success('Business model element created!');
      }
    }));
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="c-btn -secondary">Cancel</Link>
            <Button type="submit" className="c-btn -primary">Save</Button>
          </BtnGroup>
          <Input type="text" onChange={this.onInputChange} name="name" value="" placeholder="Business model element title" validations={['required']} />
          <Textarea onChange={this.onInputChange} name="description" value="" placeholder="Description" validations={['required']} />
        </Form>
      </section>
    );
  }
}

NewBmePage.propTypes = {
  categories: React.PropTypes.object
};
