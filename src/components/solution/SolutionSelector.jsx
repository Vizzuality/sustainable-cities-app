import React from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';

import { Select } from 'components/form/Form';

export default class SolutionSelector extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: {}
    };
  }

  /* lifecycle */
  componentWillReceiveProps(nextProps) {
    this.setState({
      categories: nextProps.state
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
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'parent');
      }
      categories.children = val ? options.children : {};
      categories.nephew = val ? options.nephew : {};
    }

    if (level === 'children') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'children');
      }
      categories.nephew = val ? options.nephew : {};
    }

    this.setState({ categories }, () => {
      if (this.props.onChangeSelect) {
        this.props.onChangeSelect(this.state, this.props.index);
      }
    });
  }

  @Autobind
  onDeleteSelect() {
    if (this.props.onDeleteSelect) {
      this.props.onDeleteSelect(this.props.index);
    }
  }

  getFirstSelectOption(value, source) {
    const options = {
      children: {},
      nephew: {}
    };

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === value);
      if (parentCategory.children && parentCategory.children.length) {
        options.children = parentCategory.children[0].id;
      }

      // populates nephew selector based on children selection
      const childrenCategory = parentCategory.children.find(child => child.id === options.children);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    if (source === 'children') {
      // populates nephew selector based on children selection
      const parentId = this.state.categories.parent;
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  loadMultiSelectOptions() {
    const options = {
      children: [],
      nephew: []
    };
    const { parent, children } = this.state.categories;


    if (parent) {
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parent);
      options.children = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));

      if (children) {
        const childrenCategory = parentCategory.children.find(child => child.id === children);
        options.nephew = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

    return options;
  }

  render() {
    const selectOptions = this.loadMultiSelectOptions();
    const { parent, children, nephew } = this.state.categories;

    return (
      <div className="c-solution-selector">
        <div className="row expanded">
          <div className="small-4 columns">
            <Select
              name="categories"
              value={parent}
              onChange={val => this.onCategoryChange('parent', val)}
              label="Solution group"
              options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
            />
          </div>
          <div className="small-4 columns">
            <Select
              name="categories"
              value={children}
              onChange={val => this.onCategoryChange('children', val)}
              label="Solution category"
              options={selectOptions.children}
            />
          </div>
          <div className="small-4 columns">
            <Select
              name="categories"
              value={nephew && nephew.id ? nephew.id : nephew}
              onChange={val => this.onCategoryChange('nephew', val)}
              label="Solution sub-category"
              options={selectOptions.nephew}
            />
          </div>
          {this.props.deletable && <div className="small-12 columns">
            <button type="button" className="button alert" onClick={this.onDeleteSelect}>Delete solution</button>
          </div>}
        </div>
      </div>
    );
  }
}

SolutionSelector.propTypes = {
  deletable: PropTypes.bool,
  index: PropTypes.number,
  solutionCategories: PropTypes.array,
  state: PropTypes.object,
  onChangeSelect: PropTypes.func,
  onDeleteSelect: PropTypes.func
};

SolutionSelector.defaultProps = {
  deletable: true
};
