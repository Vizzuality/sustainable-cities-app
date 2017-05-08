import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getImpacts } from 'modules/impacts';

import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';

import { Textarea, Form, Select } from 'components/form/Form';

class AddImpactForm extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      category_id: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.impacts.length || dispatch(getImpacts({ pageSize: 9999 }));
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

  onSave() {
    const status = {
      ...this.form,
      ...{ category_id: this.state.category_id }
    };

    console.log(status)

    this.props.onSave(status);
  }

  render() {
    return (
      <div className="c-create-impact-form">
        <Form onSubmit={this.onSubmit}>
          <div className="row expanded">
            <div className="small-6 columns">
              <Select
                name="category_id"
                value={this.state.category_id}
                onChange={val => this.onSelectChange('category_id', val)}
                label="Impacts"
                options={this.props.impacts.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-6 columns">
              {/* description */}
              <Textarea
                name="description"
                label="Description"
                placeholder="Description"
                onChange={this.onInputChange}
                value=""
                validations={[]}
              />
            </div>
          </div>
          <button onClick={() => this.onSave()}>Add Impact</button>
        </Form>
      </div>
    );
  }
}

AddImpactForm.propTypes = {
  impacts: PropTypes.array,
  onSave: PropTypes.func
};

const mapStateToProps = ({ impacts }) => ({
  impacts: impacts.list
});

export default connect(mapStateToProps, null)(AddImpactForm);
