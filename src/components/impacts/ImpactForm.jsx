import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { Form, Input, Button, Select } from 'components/form/Form';
import { Autobind } from 'es-decorators';

import compact from 'lodash/compact';
import difference from 'lodash/difference';

class ImpactForm extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      addedSources: [],
      categories: {}
    };

    // used to save ids will be linked with impacts
    this.external_sources_index = [];

    // used to remove sources in the database
    this.remove_external_sources = [];
  }

  /* lifecycle */
  componentWillMount() {
    const { sources, values } = this.props;
    dispatch(getCategories({ type: 'Impact', tree: true, pageSize: 9999, sort: 'name' }));

    if (sources && Object.keys(values).length) {
      this.setState({
        addedSources: values.addedSources
      }, () => { console.log(this.state); });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values && nextProps.values) {
      const { category_parent_id, category_id } = nextProps.values;

      this.setState({
        categories: {
          parent: category_parent_id,
          children: category_id
        }
      });
    }
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const { parent, children } = this.state.categories;
    const { addedSources } = this.state;
    const data = { ...this.form };

    if (children) data.category_id = children;
    if (parent) data.category_parent_id = parent;

    data.addedSources = addedSources;

    // attachs sources to impact through their indexes
    this.external_sources_index = addedSources.map(addedSource => addedSource.index);
    data.external_sources_index = this.external_sources_index;

    // gets the difference between the incoming sources and the current values
    // in order to know which one to remove
    const allSourceIds = this.props.sources.map(source => source.id);
    const currentSourceIds = addedSources.map(addedSource => addedSource.id);
    this.remove_external_sources = difference(currentSourceIds, allSourceIds);

    // if there are, adds ids to remove
    if (this.remove_external_sources.length) {
      data.remove_external_sources = this.remove_external_sources;
    }

    if (this.props.onSubmit) {
      console.log(data);
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

    const addedSources = val.map(sourceId => {
      const foundSource = this.props.sources.find(s => s.id === sourceId);

      if(foundSource) {
        return {
          id: sourceId,
          index: foundSource.index
        }
      }
    });

    this.setState({
      [field]: addedSources
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

  loadFirstChildrenOption(parentId) {
    const parentCategory = this.props.impactCategories.find(cat => cat.id === parentId);
    return parentCategory && parentCategory.children ? parentCategory.children[0].id : null;
  }

  getSources(sourceIds) {
    const { sources } = this.props;
    return sourceIds.map((id) => {
      sources[id].index = id;
      return sources[id];
    });
  }

  render() {
    const { values, text } = this.props;
    const { name, impact_value, impact_unit } = values;
    const { addedSources, categories } = this.state;
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
            <div className="column small-12">
              <Select
                multi
                name="sources"
                value={addedSources.map(addedSource => addedSource.id)}
                onChange={val => this.onSelectChange('addedSources', val)}
                label="Sources"
                options={this.props.sources.map((source, index) => ({ value: source.id || index, label: source.name }))}
              />
            </div>
            <div className="small-6 columns">
              <Select
                name="categories"
                value={parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-6 columns">
              <Select
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
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Unit"
                value={impact_unit || ''} // eslint-disable-line camelcase
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
  sources: PropTypes.array,
  values: PropTypes.object,
  text: PropTypes.string,
  onSubmit: PropTypes.func
};

ImpactForm.defaultProps = {
  values: {},
  sources: []
};

const mapStateToProps = ({ categories }) => ({
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(ImpactForm);
