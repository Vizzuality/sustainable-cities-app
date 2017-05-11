import React from 'react';
import { Form, Input, Button } from 'components/form/Form';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

export default class ImpactForm extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.form);
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  render() {
    const { values, text } = this.props;
    const { name, impactValue, impactUnit } = values;
    return (
      <div className="c-impact-form">
        <Form onSubmit={this.onSubmit}>
          <span>Impacts</span>
          <div className="row expanded">
            <div className="column small-12">
              <Input
                id="name"
                label="Name"
                defaultValue={name}
                type="text"
                name="name"
                validations={['required']}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Value"
                defaultValue={impactValue}
                name="impact_value"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Unit"
                defaultValue={impactUnit}
                name="impact_unit"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
          </div>
          <Button className="button">{text}</Button>
        </Form>
      </div>
    );
  }
}

ImpactForm.propTypes = {
  values: PropTypes.object,
  text: PropTypes.string,
  onSubmit: PropTypes.func
};

ImpactForm.defaultProps = {
  values: {}
};
