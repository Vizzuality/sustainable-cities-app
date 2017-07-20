import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { Form, Input, Button, Select } from 'components/form/Form';
import { Autobind } from 'es-decorators';

import difference from 'lodash/difference';

class ImpactForm extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {},
      // used to add new sources
      external_sources_ids: []
    };

    // used to remove sources already added in the database
    this.remove_ids = [];
  }

  /* lifecycle */
  componentWillMount() {
    const { sources, values } = this.props;
    dispatch(getCategories({ type: 'Impact', tree: true, pageSize: 9999, sort: 'name' }));

    // for editing...
    if (sources && Object.keys(values).length) {
      this.setState({
        external_sources_ids: values.external_sources_ids
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.impactCategories.length) {
      let parent = null;
      nextProps.impactCategories.forEach((parentCategory) => {
        const exists = parentCategory.children.find(child => child.id === this.props.values.category_id);
        if (exists) parent = parentCategory.id;
      });

      this.setState({
        categories: {
          parent,
          children: this.props.values.category_id
        }
      });
    }
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const { parent, children } = this.state.categories;
    const { external_sources_ids } = this.state;
    const data = { ...this.form };

    if (children) data.category_id = children;
    if (parent) data.category_parent_id = parent;

    // links sources ids to impact
    data.external_sources_ids = external_sources_ids; // eslint-disable-line camelcase

    // add ids to remove
    if (this.remove_ids.length) {
      data.remove_external_sources = this.remove_ids;
    }

    if (this.props.onSubmit) {
      this.props.onSubmit(data);
    }
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSelectChange(field, initialVal) {
    let val = initialVal;
    if (!Array.isArray(val)) {
      val = val.value;
    } else {
      val = val.map(v => v.value);
    }

    // gets the sources id removed
    this.sourceIndexes = [];
    this.remove_ids = difference(this.state.external_sources_ids, val);
    val.forEach((v) => {
      const source = this.props.sources.find(s => s.id === v);
      if (source) {
        this.sourceIndexes.push(source.index);
      }
    });

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

  getSources(sourceIds) {
    const { sources } = this.props;
    return sourceIds.map((id) => {
      sources[id].index = id;
      return sources[id];
    });
  }

  loadFirstChildrenOption(parentId) {
    const parentCategory = this.props.impactCategories.find(cat => cat.id === parentId);
    return parentCategory && parentCategory.children ? parentCategory.children[0].id : null;
  }

  render() {
    const { values, text } = this.props;
    const { name, impact_value, impact_unit } = values;
    const { external_sources_ids, categories } = this.state;
    const { parent, children } = categories;

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
                value={name || ''}
                type="text"
                name="name"
                validations={['required']}
                onChange={this.onInputChange}
              />
            </div>
            {/* Sources */}
            {this.props.showSources &&
              <div className="column small-12">
                <Select
                  multi
                  required
                  name="sources"
                  value={external_sources_ids} // eslint-disable-line camelcase
                  onChange={val => this.onSelectChange('external_sources_ids', val)}
                  label="Sources"
                  options={
                    this.props.sources.map((source, index) => ({
                      value: source.id || index,
                      label: source.name
                    }))
                  }
                />
              </div>}
            <div className="small-6 columns">
              <Select
                required
                name="categories"
                value={parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-6 columns">
              <Select
                required
                name="categories"
                value={children}
                onChange={val => this.onCategoryChange('children', val)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Value"
                value={impact_value || ''} // eslint-disable-line camelcase
                name="impact_value"
                validations={['required']}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Unit"
                value={impact_unit || ''} // eslint-disable-line camelcase
                name="impact_unit"
                validations={['required']}
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
  sources: PropTypes.array,
  values: PropTypes.object,
  text: PropTypes.string,
  onSubmit: PropTypes.func,
  showSources: PropTypes.bool
};

ImpactForm.defaultProps = {
  values: {},
  sources: [],
  showSources: true
};

const mapStateToProps = ({ categories }) => ({
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(ImpactForm);
