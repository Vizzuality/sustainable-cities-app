import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { getBmes } from 'modules/bmes';
import { getEnablings, updateEnabling } from 'modules/enablings';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getEnablingDetail from 'selectors/enablingDetail';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

class EditBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      bme_ids: null,
      category_id: null,
      /* radio buttons */
      assessment_value: {
        success: true,
        barrier: false
      }
    };
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getBmes({ pageSize: 9999 }));
    dispatch(getCategories({ type: 'enablings', tree: false, pageSize: 9999, sort: 'name' }));
    if (!this.props.enablingDetail) {
      dispatch(getEnablings({ id: this.props.enablings.detailId }));
    } else {
      this.fillFields(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.enablingDetail, nextProps.enablingDetail)) {
      this.fillFields(nextProps);
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, initialVal) {
    let val = initialVal;
    if (Array.isArray(val)) {
      val = val.map(v => v.value);
    } else {
      val = val.value;
    }

    this.setState({
      [field]: val
    });
  }

  @Autobind
  onRadioChange(evt) {
    this.state[evt.target.name] = {
      success: evt.target.value === 'Success',
      barrier: evt.target.value === 'Barrier'
    };

    this.form = {
      ...this.form,
      assessment_value: evt.target.value
    };

    this.setState(this.state);
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Update Enabling
    dispatch(updateEnabling({
      id: this.props.enablingDetail.id,
      data: {
        ...this.form,
        ...this.state.bme_ids,
        ...this.state.category_id
      },
      onSuccess() {
        toastr.success('Enabling condition edited!');
      }
    }));
  }

  fillFields({ enablingDetail }) {
    const categoryId = enablingDetail.relationships.category.data ?
      enablingDetail.relationships.category.data.id : null;
    const activeBmes = enablingDetail.relationships.bmes.data.map(bme => bme.id);
    const factor = enablingDetail.assessment_value;

    this.setState({
      category_id: categoryId,
      bme_ids: activeBmes,
      assessment_value: {
        success: factor === 'Success',
        barrier: factor === 'Barrier'
      }
    });
  }

  render() {
    const { name, description } = this.props.enablingDetail || {};

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/enabling-condition" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          <Input
            type="text"
            onChange={this.onInputChange}
            name="name"
            value={name || ''}
            label="Enabling condition title"
            validations={['required']}
          />
          <Textarea
            onChange={this.onInputChange}
            name="description"
            value={description || ''}
            label="Description"
            validations={['required']}
          />
          <Select
            required
            name="category"
            label="Category"
            value={this.state.category_id}
            onChange={val => this.onSelectChange('category_id', val)}
            options={this.props.categories.enablings.map(cat => ({ value: cat.id, label: cat.name }))}
          />
          <div className="radio-group">
            <label htmlFor="assessment_value">Success factor/barrier</label>
            <input
              type="radio"
              value="Success"
              name="assessment_value"
              onChange={this.onRadioChange}
              checked={this.state.assessment_value.success}
            /> Success
            <input
              type="radio"
              value="Barrier"
              name="assessment_value"
              onChange={this.onRadioChange}
              checked={this.state.assessment_value.barrier}
            />Barrier
          </div>
          <Select
            name="bme_ids"
            label="Affected business model elements"
            multi
            required
            value={this.state.bme_ids}
            onChange={val => this.onSelectChange('bme_ids', val)}
            options={this.props.bmes.list.map(bme => ({ value: bme.id, label: bme.name }))}
          />
        </Form>
      </section>
    );
  }
}

EditBmePage.propTypes = {
  bmes: PropTypes.object,
  categories: PropTypes.object,
  enablings: PropTypes.object,
  enablingDetail: PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  categories: state.categories,
  enablings: state.enablings,
  enablingDetail: getEnablingDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
