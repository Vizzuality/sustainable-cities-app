import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getBmes } from 'modules/bmes';
import { createEnabling, getEnablings, getCategories } from 'modules/enablings';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

class NewEnablingPage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.enablings.categories.length || dispatch(getCategories());
    dispatch(getBmes());
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
    dispatch(createEnabling({
      data: this.form,
      onSuccess: () => {
        toastr.success('Enabling condition created!');
      }
    }));
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/enabling-condition" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <Textarea onChange={this.onInputChange} name="description" value="" label="Description" validations={['required']} />
          <Select name="category" label="Category" validations={['required']} value="">
            {this.props.enablings.categories.map((category, i) => <option key={i} value={category.id}>{category.name}</option>)}
          </Select>
          <Select name="enablings" label="Enabling conditions" validations={['required']} value="">
            {this.props.enablings.list.map((enabling, i) => <option key={i} value={enabling.id}>{enabling.name}</option>)}
          </Select>
          <Input type="text" onChange={this.onInputChange} name="name" value="" label="Success factor/barrier" validations={['required']} />
          <Select name="business-model-elements" label="Affected business model elements" validations={['required']} value="">
            {this.props.bmes.list.map((enabling, i) => <option key={i} value={enabling.id}>{enabling.name}</option>)}
          </Select>
        </Form>
      </section>
    );
  }
}

NewEnablingPage.propTypes = {
  /* state */
  bmes: PropTypes.object,
  enablings: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ bmes, enablings }) => ({
  bmes,
  enablings
});

export default connect(mapStateToProps, null)(NewEnablingPage);
