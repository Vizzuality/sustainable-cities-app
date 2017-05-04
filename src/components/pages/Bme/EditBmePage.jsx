import React from 'react';
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
      categories: {},
      enablings: {},
      timing: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.bmeCategories.length || dispatch(getCategories({ type: 'Bme', tree: true }));
    this.props.timingCategories.length || dispatch(getCategories({ type: 'timing' }));
    this.props.enablings.list.length || dispatch(getEnablings());

    if (!this.props.bmesDetail) {
      dispatch(getBmes({ id: this.props.bmes.detailId }));
    } else {
      this.fillFields(this.props);
      this.setCategories(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.bmesDetail, nextProps.bmesDetail)) {
      this.fillFields(nextProps);
    }

    if (!isEqual(this.props.bmeCategories, nextProps.bmeCategories) &&
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
    // Update BME
    dispatch(updateBme({
      id: this.props.bmesDetail.id,
      data: {
        ...this.form,
        category_ids: [...this.state.timing, ...[this.state.categories.nephew]],
        enabling_ids: this.state.enablings
      },
      onSuccess() {
        toastr.success('Business model element edited!');
      }
    }));
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

    this.setState({ categories });
  }

  getFirstSelectOption(value, source) {
    const options = {
      children: {},
      nephew: {}
    };

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.props.bmeCategories.find(cat => cat.id === value);
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
      const parentCategory = this.props.bmeCategories.find(cat => cat.id === parentId);
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

  setCategories({ bmesDetail, bmeCategories }) {
    const nephewCategory = bmesDetail.categories.filter(cat => cat.category_type === 'Bme')[0];

    if (!nephewCategory) return;

    const childrenCategoryId = nephewCategory ? nephewCategory.relationships.parent.data.id : {};

    const parentCategory = childrenCategoryId ? bmeCategories.find((cat) => {
      return cat.children.find(c => c.id === childrenCategoryId);
    }) : {};

    this.setState({
      categories: {
        parent: parentCategory.id,
        children: childrenCategoryId,
        nephew: nephewCategory.id
      }
    });
  }

  fillFields({ bmesDetail }) {
    this.setTimingCategory(bmesDetail);
    this.setEnablingConditions(bmesDetail);
  }

  render() {
    const { parent, children } = this.state.categories;

    let childrenOptions = [];
    let nephewOptions = [];
    let parentCategory = null;
    let childrenCategory = null;

    if (parent) {
      parentCategory = this.props.bmeCategories.find(cat => cat.id === this.state.categories.parent);
      childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));

      if (children) {
        childrenCategory = parentCategory.children.find(child => child.id === this.state.categories.children);
        nephewOptions = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

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
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            { /* Children Category */}
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="small-4 columns">
              { /* Nephew Category */}
              <Select
                name="categories"
                value={this.state.categories.nephew}
                onChange={val => this.onCategoryChange('nephew', val)}
                label="Sub-sub-category"
                options={nephewOptions}
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
        </Form>
      </section>
    );
  }
}

EditBmePage.propTypes = {
  bmes: React.PropTypes.object,
  bmeCategories: React.PropTypes.array,
  enablings: React.PropTypes.object,
  timingCategories: React.PropTypes.array,
  // Selector
  bmesDetail: React.PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  bmeCategories: state.categories.Bme,
  enablings: state.enablings,
  timingCategories: state.categories.timing,
  bmesDetail: getBmeDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
