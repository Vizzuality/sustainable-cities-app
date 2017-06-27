import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { push } from 'react-router-redux';

import { createImpact } from 'modules/impacts';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

class NewImpactPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    if (!this.props.impactCategories.length) {
      dispatch(getCategories({ type: 'Impact', tree: true, pageSize: 9999 }));
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, initialVal) {
    let val = initialVal;
    if (!Array.isArray(val)) {
      val = val.value;
    } else {
      val = val.map(v => v.value);
    }

    this.setState({
      [field]: val
    });
  }

  onCategoryChange(level, initialVal) {
    let val = initialVal;
    if (val) {
      val = Array.isArray(val) ?
        val.map(i => i.value) : val.value;
    }

    const categories = {
      ...this.state.categories,
      [level]: val
    };

    if (level === 'parent') {
      categories.children = this.loadFirstChildrenOption(val);
    }

    this.setState({ categories });
  }


  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    let categoryIds = [];

    if (this.state.categories.children && this.state.categories.children.length) {
      categoryIds = this.state.categories.children;
    } else {
      categoryIds = this.state.categories.parent;
    }

    // creates impact
    dispatch(createImpact({
      data: {
        ...this.form,
        ...{ category_id: categoryIds }
      },
      onSuccess: () => {
        // Redirect to impact list
        dispatch(push('/impact'));
        toastr.success('Impact created!');
      }
    }));
  }

  loadFirstChildrenOption(parentId) {
    const parentCategory = this.props.impactCategories.find(cat => cat.id === parentId);
    return parentCategory && parentCategory.children ? parentCategory.children[0].id : null;
  }

  render() {
    const { parent } = this.state.categories;

    const parentOptions = this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }));
    let childrenOptions = [];
    let parentCategory = null;

    if (parent) {
      parentCategory = this.props.impactCategories.find(cat => cat.id === this.state.categories.parent);
      childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
    }

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/impact" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          {/* Categories */}
          <div className="row expanded">
            <div className="small-12 columns">
              {/* Name */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="name"
                value=""
                label="Impact name"
                validations={['required']}
              />
            </div>
            <div className="small-6 columns">
              <Select
                name="categories"
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={parentOptions}
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
            <div className="small-6 columns">
              {/* Unit */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="impact_unit"
                value=""
                label="Unit"
                validations={['required']}
              />
            </div>
            <div className="small-6 columns">
              {/* Value */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="impact_value"
                value=""
                label="Value"
                validations={['required']}
              />
            </div>
            {/* TODO: add source */}
          </div>
        </Form>
      </section>
    );
  }
}

NewImpactPage.propTypes = {
  impactCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ categories }) => ({
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(NewImpactPage);
