import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { Form, Input, Button, Select } from 'components/form/Form';
import { Autobind } from 'es-decorators';

class ImpactForm extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {}
    };
  }

  /* lifecycle */
  componentWillMount() {
    dispatch(getCategories({ type: 'Impact', tree: true, pageSize: 9999, sort: 'name' }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values && nextProps.values.categories) {
      this.setState({
        categories: {
          parent: nextProps.values.categories.parent,
          children: nextProps.values.categories.children
        }
      });
    }
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    this.props.onSubmit && this.props.onSubmit({
      ...this.form,
      ...{ categories: {
        parent: this.state.categories.parent,
        children: this.state.categories.children
      } }
    });
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onCategoryChange(level, val) {
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

  loadFirstChildrenOption(parentId) {
    const parentCategory = this.props.impactCategories.find(cat => cat.id === parentId);
    return parentCategory && parentCategory.children ? parentCategory.children[0].id : null;
  }

  render() {
    const { values, text } = this.props;
    const { name, impact_value, impact_unit } = values;
    const { parent } = this.state.categories;

    let childrenOptions = [];
    let parentCategory = null;

    if (parent) {
      parentCategory = this.props.impactCategories.find(cat => cat.id === this.state.categories.parent);
      childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
    }

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
            <div className="column small-6">
              <Input
                type="text"
                label="Value"
                defaultValue={impact_value}
                name="impact_value"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Unit"
                defaultValue={impact_unit}
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
  impactCategories: PropTypes.array,
  values: PropTypes.object,
  text: PropTypes.string,
  onSubmit: PropTypes.func
};

ImpactForm.defaultProps = {
  values: {}
};

const mapStateToProps = ({ categories }) => ({
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(ImpactForm);
