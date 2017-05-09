import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getBmes } from 'modules/bmes';
import { createEnabling, getEnablings } from 'modules/enablings';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Textarea, Select, Radio } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class NewEnablingPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      category_id: null,
      bme_ids: null
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.enablings.categories.length || dispatch(getCategories({ type: 'enablings', tree: false, pageSize: 9999, sort: 'name' }));
    dispatch(getBmes({ pageSize: 9999 }));
    dispatch(getEnablings());
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    if (!Array.isArray(val)) {
      val = val.value
    } else {
      val = val.map(v => v.value);
    }

    this.setState({
      [field]: val
    });
  }

  @Autobind
  onRadioChange(evt) {
    this.form = {
      ...this.form,
      assessment_value: evt.target.value
    };
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // creates enabling condition
    dispatch(createEnabling({
      data: {
        ...this.form,
        ...this.state
      },
      onSuccess: () => {
        dispatch(push('/enabling-condition'));
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
          <Input type="text" onChange={this.onInputChange} name="name" value="" label="Enabling condition title" validations={['required']} />
          <Textarea onChange={this.onInputChange} name="description" value="" label="Description" validations={['required']} />
          <Select
            name="category"
            label="Category"
            validations={['required']}
            value={this.state.category_id}
            onChange={val => this.onSelectChange('category_id', val)}
            options={this.props.categories.enablings.map(cat => ({ value: cat.id, label: cat.name }))}
          />
          <div className="radio-group">
            <label htmlFor="success-barrier">Success factor/barrier</label>
            <input
              type="radio"
              value="Success"
              name="success-barrier"
              onChange={this.onRadioChange}
              defaultChecked
            /> Success
            <input
              type="radio"
              value="Barrier"
              name="success-barrier"
              onChange={this.onRadioChange}
            /> Barrier
          </div>
          <Select
            name="bme_ids"
            label="Affected business model elements"
            multi
            validations={['required']}
            value={this.state.bme_ids}
            onChange={val => this.onSelectChange('bme_ids', val)}
            options={this.props.bmes.list.map(bme => ({ value: bme.id, label: bme.name }))}
          />
        </Form>
      </section>
    );
  }
}

NewEnablingPage.propTypes = {
  /* state */
  bmes: PropTypes.object,
  categories: PropTypes.object,
  enablings: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ bmes, categories, enablings }) => ({
  bmes,
  categories,
  enablings
});

export default connect(mapStateToProps, null)(NewEnablingPage);
