import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Autobind } from 'es-decorators';
import DropZone from 'components/dropzone/DropZone';

import { Select } from 'components/form/Form';

const MAX_SIZE_PDF = 1048576 * 10; // 10MB

class SolutionSelector extends PureComponent {
  static propTypes = {
    deletable: PropTypes.bool,
    index: PropTypes.number,
    solutionCategories: PropTypes.array,
    state: PropTypes.object,
    onChangeSelect: PropTypes.func,
    onDeleteSelect: PropTypes.func,
    mandatoryLevels: PropTypes.array,
    hideSubCategory: PropTypes.bool,
    files: PropTypes.array,
    showPDF: PropTypes.bool,
    onAddNewPDF: PropTypes.func,
    onRemovePDF: PropTypes.func
  }

  static defaultProps = {
    deletable: true,
    mandatoryLevels: [],
    hideSubCategory: false,
    showPDF: false,
    files: [],
    onAddNewPDF: null,
    onRemovePDF: null
  }

  constructor(props) {
    super(props);

    this.state = { categories: props.state };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ categories: nextProps.state });
  }

  onCategoryChange(level, initialVal) {
    let val = initialVal;
    const { mandatoryLevels } = this.props;
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
      if (val && mandatoryLevels.includes(2)) {
        options = this.getFirstSelectOption(val, 'parent');
      }

      categories.children = val ? options.children : {};
      categories.nephew = val ? options.nephew : 'all';
    }

    if (level === 'children') {
      let options = {};
      if (val && mandatoryLevels.includes(3)) {
        options = this.getFirstSelectOption(val, 'children');
      }
      categories.nephew = val ? options.nephew : 'all';
    }

    this.setState({ categories }, () => {
      if (this.props.onChangeSelect) {
        this.props.onChangeSelect(categories, this.props.index);
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
    const { mandatoryLevels } = this.props;
    const options = {
      children: {},
      nephew: {}
    };
    const { hideSubCategory } = this.props;

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === value);
      if (parentCategory.children && parentCategory.children.length) {
        // if (mandatoryLevels.includes(2)) {
        //   options.children = 'all';
        // }
        // if (!mandatoryLevels.includes(2))
        options.children = (parentCategory.children[0] || {}).id;
      }

      // populates nephew selector based on children selection
      const childrenCategory = (parentCategory.children || []).find(child => child.id === options.children);
      if (childrenCategory && childrenCategory.children && childrenCategory.children.length && mandatoryLevels.includes(2)) {
        options.nephew = 'all';
      }
    }

    if (source === 'children' && mandatoryLevels.includes(3) && !hideSubCategory) {
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
      parent: [],
      children: [],
      nephew: []
    };
    const { parent, children } = this.state.categories || {};
    const { mandatoryLevels, hideSubCategory } = this.props;

    options.parent = this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }));

    if (!mandatoryLevels.includes(1)) (options.parent || []).unshift({ value: 'all', label: 'All' });

    if (parent && parent !== 'all') {
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parent) || {};
      options.children = (parentCategory.children || []).map(cat => ({ value: cat.id, label: cat.name }));

      if (!mandatoryLevels.includes(2)) (options.children || []).unshift({ value: 'all', label: 'All' });

      if (children && !hideSubCategory) {
        const childrenCategory = (parentCategory.children || []).find(child => child.id === children);
        options.nephew = childrenCategory && (childrenCategory.children || []).map(cat => ({ value: cat.id, label: cat.name }));

        if (!mandatoryLevels.includes(3)) (options.nephew || []).unshift({ value: 'all', label: 'All' });
      }
    }

    return options;
  }

  render() {
    const selectOptions = this.loadMultiSelectOptions();
    const { parent, children, nephew } = this.state.categories || {};
    const {
      mandatoryLevels,
      hideSubCategory,
      onAddNewPDF,
      onRemovePDF,
      files,
      showPDF
    } = this.props;

    return (
      <div className="c-solution-selector">
        <div className="row expanded -flex">
          <div className="small-4 columns">
            <Select
              required={mandatoryLevels.includes(1)}
              name="categories"
              value={parent}
              onChange={val => this.onCategoryChange('parent', val)}
              label="Solution group"
              options={selectOptions.parent}
            />
          </div>
          <div className="small-4 columns">
            <Select
              required={mandatoryLevels.includes(2)}
              name="categories"
              value={mandatoryLevels.includes(2) && !children ? (selectOptions.children[0] || {}).value : children}
              onChange={val => this.onCategoryChange('children', val)}
              label="Solution category"
              options={selectOptions.children}
            />
          </div>
          {!hideSubCategory &&
            <div className="small-4 columns">
              <Select
                required={mandatoryLevels.includes(3)}
                name="categories"
                value={nephew || (selectOptions.nephew[0] || {}).value}
                onChange={val => this.onCategoryChange('nephew', val)}
                label="Solution sub-category"
                options={selectOptions.nephew}
              />
            </div>}
          {this.props.deletable && <div className="small-12 columns">
            <button type="button" className="button alert" onClick={this.onDeleteSelect}>Delete solution</button>
          </div>}
        </div>
        {showPDF &&
          <div className="row expanded -flex">
            <div className="small-12 medium-4 columns">
              <DropZone
                title="Attach a PDF file (optional)"
                accept={'application/pdf'}
                files={files}
                onDrop={onAddNewPDF}
                onDelete={onRemovePDF}
                multiple={false}
                maxSize={MAX_SIZE_PDF}
              />
            </div>
          </div>}
      </div>
    );
  }
}

export default SolutionSelector;
