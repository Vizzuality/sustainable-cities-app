import React from 'react';
import { dispatch } from 'main';
import { getBmes } from 'modules/bmes';
import { getEnablings, updateEnabling } from 'modules/enablings';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getEnablingDetail from 'selectors/enablingDetail';
import { validation } from 'utils/validation';
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
      'success-barrier': {
        success: true,
        barrier: false
      }
    };
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getBmes());
    dispatch(getCategories({ type: 'enablings', tree: false }));
    if (!this.props.enablingDetail) {
      dispatch(getEnablings({ id: this.props.enablings.detailId }));
    }
  }

  componentDidMount() {
    if (this.props.enablingDetail) {
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

  onSelectChange(field, val) {
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
  onSuccessChange(evt) {
    this.state[evt.target.name] = {
      success: true,
      barrier: false
    };

    this.setState(this.state);

    this.form = {
      ...this.form,
      assessment_value: evt.target.value
    };
  }

  @Autobind
  onBarrierChange(evt) {
    this.state[evt.target.name] = {
      success: false,
      barrier: true
    };

    this.setState(this.state);
    this.form = {
      ...this.form,
      assessment_value: evt.target.value
    };
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Update Enabling
    dispatch(updateEnabling({
      id: this.props.enablingDetail.id,
      data: {
        ...this.form,
        ...this.state
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
      'success-barrier': {
        success: factor === 'Success',
        barrier: factor === 'Barrier'
      }
    });
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          <Input
            type="text"
            onChange={this.onInputChange}
            name="name" value={this.props.enablingDetail ? this.props.enablingDetail.name : ''}
            label="Enabling condition title"
            validations={['required']}
          />
          <Textarea
            onChange={this.onInputChange}
            name="description"
            value={this.props.enablingDetail ? this.props.enablingDetail.description : ''}
            label="Description"
            validations={['required']}
          />
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
              onChange={this.onSuccessChange}
              checked={this.state['success-barrier'].success}
            /> Success
            <input
              type="radio"
              value="Barrier"
              name="success-barrier"
              onChange={this.onBarrierChange}
              checked={this.state['success-barrier'].barrier}
            />Barrier
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

EditBmePage.propTypes = {
  bmes: React.PropTypes.object,
  categories: React.PropTypes.object,
  enablings: React.PropTypes.object,
  enablingDetail: React.PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  categories: state.categories,
  enablings: state.enablings,
  enablingDetail: getEnablingDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
