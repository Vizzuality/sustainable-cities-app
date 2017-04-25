import React from 'react';
import { dispatch } from 'main';
import { getCategories } from 'modules/bmes';
import { createBme } from 'modules/bmes';
import { getEnablings } from 'modules/enablings';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

class NewBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.bmes.categories.length || dispatch(getCategories());
    dispatch(getEnablings());
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
      onSuccess: () => {
        toastr.success('Business model element created!');
      }
    }));
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <Select name="category" label="Category" validations={['required']} value="">
            {this.props.bmes.categories.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
          </Select>
          <Select name="enablings" label="Enabling conditions" validations={['required']} value="">
            {this.props.enablings.list.map((enabling, i) => <option key={i} value={enabling.id}>{enabling.name}</option>)}
          </Select>
          <Input type="text" onChange={this.onInputChange} name="name" value="" label="Business model element title" validations={['required']} />
          <Textarea onChange={this.onInputChange} name="description" value="" label="Description" validations={['required']} />
        </Form>
      </section>
    );
  }
}

NewBmePage.propTypes = {
  // State
  bmes: React.PropTypes.object,
  enablings: React.PropTypes.object
};

// Map state to props
const mapStateToProps = ({ user, bmes, enablings }) => ({
  user,
  bmes,
  enablings
});

export default connect(mapStateToProps, null)(NewBmePage);
