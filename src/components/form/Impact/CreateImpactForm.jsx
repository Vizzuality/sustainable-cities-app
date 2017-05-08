import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Input, Form, Select } from 'components/form/Form';

class CreateImpactForm extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {}
    };
  }

  render() {
    const { parent } = this.state.categories;
    let childrenOptions = [];

    if (parent) {
      const parentCategory = this.props.impactCategories.find(cat => cat.id === this.state.categories.parent);
      childrenOptions = parentCategory ? parentCategory.children.map(cat => ({ value: cat.id, label: cat.name })) : [];
    }

    return (
      <div className="c-create-impact-form">
        <Form onSubmit={this.onSubmit}>
          <div className="row expanded">
            <div className="small-6 columns">
              <Select
                name="categories"
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-6 columns">
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
          </div>
          <div className="row expanded">
            {/* name */}
            <div className="small-12 columns">
              <Input type="text" onChange={this.onInputChange} name="name" value="" label="Impact name" validations={['required']} />
            </div>
          </div>
          <div className="row expanded">
            {/* unit */}
            <div className="small-6 columns">
              <Input type="text" onChange={this.onInputChange} name="impact_unit" value="" label="Unit" validations={['required']} />
            </div>
            {/* value */}
            <div className="small-6 columns">
              <Input type="text" onChange={this.onInputChange} name="impact_value" value="" label="Value" validations={['required']} />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

CreateImpactForm.propTypes = {
  impactCategories: PropTypes.array
};

const mapStateToProps = ({ categories }) => ({
  impactCategories: categories.Impact
});

export default connect(mapStateToProps, null)(CreateImpactForm);
