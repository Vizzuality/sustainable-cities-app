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
    this.state = {
      enablings: [],
      categories: []
    };
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

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value).join(',')
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form,
      category_ids: this.state.categories.split(','),
      enablings_ids: this.state.enablings.split(',')
    };

    // Create Bme
    dispatch(createBme({
      data,
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
          <Select
            multi
            name="categories"
            value={this.state.categories}
            onChange={val => this.onSelectChange('categories', val)}
            delimiter=","
            label="Category"
            validations={['required']}
            options={this.props.bmes.categories.map(cat => ({ value: cat.id, label: cat.name }))}
          />
          <Select
            multi
            name="enablings"
            value={this.state.enablings}
            onChange={val => this.onSelectChange('enablings', val)}
            label="Enabling conditions"
            delimiter=","
            validations={['required']}
            options={this.props.enablings.list.map(en => ({ value: en.id, label: en.name }))}
          />
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
