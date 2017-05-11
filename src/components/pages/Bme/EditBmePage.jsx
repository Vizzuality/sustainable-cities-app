import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getBmes, updateBme } from 'modules/bmes';
import { getCategories } from 'modules/categories';
import { getEnablings } from 'modules/enablings';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getBmeDetail from 'selectors/bmeDetail';
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
      categories: {
        bme: {},
        solution: {}
      },
      enablings: {},
      timing: {}
    };

    this.categoryGroups = {
      bme: props.bmeCategories,
      solution: props.solutionCategories
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.bmeCategories.length || dispatch(getCategories({ type: 'Bme', tree: true, pageSize: 9999 }));
    this.props.solutionCategories.length || dispatch(getCategories({ type: 'Solution', tree: true, pageSize: 9999 }));
    this.props.timingCategories.length || dispatch(getCategories({ type: 'timing', pageSize: 9999 }));
    this.props.enablings.list.length || dispatch(getEnablings({ pageSize: 9999 }));

    if (!this.props.bmesDetail) {
      dispatch(getBmes({ id: this.props.bmes.detailId }));
    } else {
      this.fillFields(this.props);
      this.setCategories(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { bmeCategories, solutionCategories, bmesDetail } = this.props;
    if (!isEqual(bmeCategories, nextProps.bmeCategories)) {
      this.categoryGroups = {
        ...this.categoryGroups,
        ...{ bme: nextProps.bmeCategories }
      };
    }

    if (!isEqual(solutionCategories, nextProps.solutionCategories)) {
      this.categoryGroups = {
        ...this.categoryGroups,
        ...{ solution: nextProps.solutionCategories }
      };
    }

    if (!isEqual(bmesDetail, nextProps.bmesDetail)) {
      this.fillFields(nextProps);
    }

    // review this
    if (!isEqual(bmeCategories, nextProps.bmeCategories) &&
      this.props.bmesDetail !== undefined) {
      this.setCategories(nextProps);
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value)
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form,
      category_ids: [...this.state.timing, ...[this.state.categories.bme.nephew]],
      enabling_ids: this.state.enablings,
      solution_id: [this.state.categories.solution.nephew]
    };

    // Update BME
    dispatch(updateBme({
      id: this.props.bmesDetail.id,
      data,
      onSuccess() {
        toastr.success('Business model element edited!');
      }
    }));
  }

  onCategoryChange(group, level, val) {
    if (val) {
      val = Array.isArray(val) ?
        val.map(i => i.value) : val.value;
    }

    const categories = {
      ...this.state.categories[group],
      [level]: val
    };

    if (level === 'parent') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'parent', group);
      }
      categories.children = val ? options.children : {};
      categories.nephew = val ? options.nephew : {};
    }

    if (level === 'children') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'children', group);
      }
      categories.nephew = val ? options.nephew : {};
    }

    const newState = {
      ...this.state.categories,
      ...{ [group]: categories }
    };

    this.setState({ categories: newState });
  }

  getFirstSelectOption(value, source, categoryGroupId) {
    const options = {
      children: {},
      nephew: {}
    };

    if (!this.categoryGroups[categoryGroupId]) return {};

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === value);
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
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  setTimingCategory(bmesDetail) {
    // looks for timing categories
    const activeTimingCategories = bmesDetail.categories.filter(cat => cat.category_type === 'Timing');

    // retrieves their ids
    const activeTimingCategoriesIds = activeTimingCategories.map(cat => cat.id);

    this.setState({
      timing: activeTimingCategoriesIds
    });
  }

  setEnablingConditions(bmesDetail) {
    const activeEnablings = bmesDetail.relationships.enablings.data.map(en => en.id);

    this.setState({
      enablings: activeEnablings
    });
  }

  setCategories({ bmesDetail }) {
    let newState = {};
    Object.keys(this.categoryGroups).forEach((key) => {
      let nephewCategory;

      switch (key) {
        case 'bme':
          nephewCategory = bmesDetail.categories.filter(cat => cat.category_type === 'Bme')[0];
          break;
        case 'solution':
          nephewCategory = bmesDetail.categories.filter(cat => cat.category_type === 'Solution')[0];
          break;
        default:
          break;
      }

      if (!nephewCategory) {
        newState = {
          ...newState,
          ...newState.categories,
          ...{ [key]: {} }
        };
        return;
      }

      const childrenCategoryId = nephewCategory ? nephewCategory.relationships.parent.data.id : {};

      const parentCategory = childrenCategoryId ? this.categoryGroups[key].find((cat) => {
        return cat.children.find(c => c.id === childrenCategoryId);
      }) : {};


      newState = {
        ...newState,
        ...newState.categories,
        ...{ [key]: {
          parent: parentCategory ? parentCategory.id : null,
          children: childrenCategoryId,
          nephew: nephewCategory.id
        } }
      };
    });

    this.setState({ categories: newState });
  }

  fillFields({ bmesDetail }) {
    this.setTimingCategory(bmesDetail);
    this.setEnablingConditions(bmesDetail);
  }

  loadMultiSelectOptions(categoryState, categoryGroupId) {
    const options = {
      children: [],
      nephew: []
    };

    const { parent, children } = categoryState;

    if (!this.categoryGroups[categoryGroupId]) return {};

    if (parent) {
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === parent);
      options.children = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));

      if (children) {
        const childrenCategory = parentCategory.children.find(child => child.id === children);
        options.nephew = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

    return options;
  }

  render() {
    const bmeSelectOptions = this.loadMultiSelectOptions(this.state.categories.bme, 'bme');
    const solutionSelectOptions = this.loadMultiSelectOptions(this.state.categories.solution, 'solution');

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          {/* name */}
          <Input
            type="text"
            name="name"
            label="BME name"
            placeholder="Business model element title"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.props.bmesDetail ? this.props.bmesDetail.name : ''}
          />
          {/* categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              { /* Parent Category */}
              <Select
                name="categories"
                value={this.state.categories.bme.parent}
                onChange={val => this.onCategoryChange('bme', 'parent', val)}
                label="Category"
                options={this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            { /* Children Category */}
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.bme.children}
                onChange={val => this.onCategoryChange('bme', 'children', val)}
                label="Sub-category"
                options={bmeSelectOptions.children}
              />
            </div>
            <div className="small-4 columns">
              { /* Nephew Category */}
              <Select
                name="categories"
                value={this.state.categories.bme.nephew}
                onChange={val => this.onCategoryChange('bme', 'nephew', val)}
                label="Sub-sub-category"
                options={bmeSelectOptions.nephew}
              />
            </div>
          </div>
          {/* enabling conditions */}
          <Select
            multi
            name="enablings"
            value={this.state.enablings}
            onChange={val => this.onSelectChange('enablings', val)}
            label="Enabling conditions"
            delimiter=","
            options={this.props.enablings.list.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* timing */}
          <Select
            multi
            name="timing"
            value={this.state.timing}
            onChange={val => this.onSelectChange('timing', val)}
            label="Timing"
            options={this.props.timingCategories.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* Solution categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.solution.parent}
                onChange={val => this.onCategoryChange('solution', 'parent', val)}
                label="Solution group"
                options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.solution.children}
                onChange={val => this.onCategoryChange('solution', 'children', val)}
                label="Solution category"
                options={solutionSelectOptions.children}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.solution.nephew}
                onChange={val => this.onCategoryChange('solution', 'nephew', val)}
                label="Solution sub-category"
                options={solutionSelectOptions.nephew}
              />
            </div>
          </div>
          {/* description */}
          <Textarea
            name="description"
            label="Description"
            placeholder="Description"
            onChange={this.onInputChange}
            value={this.props.bmesDetail && this.props.bmesDetail.description ? this.props.bmesDetail.description : ''}
            validations={[]}
          />
        </Form>
      </section>
    );
  }
}

EditBmePage.propTypes = {
  bmes: PropTypes.object,
  bmeCategories: PropTypes.array,
  enablings: PropTypes.object,
  solutionCategories: PropTypes.array,
  timingCategories: PropTypes.array,
  // Selector
  bmesDetail: PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  bmeCategories: state.categories.bme,
  solutionCategories: state.categories.solution,
  timingCategories: state.categories.timing,
  enablings: state.enablings,
  bmesDetail: getBmeDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
