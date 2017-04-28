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
        category_ids: [...this.state.categories.nephew, ...this.state.timing],
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
      categories.children = null;
      categories.nephew = [];
    }

    if (level === 'children') {
      categories.nephew = [];
    }

    this.setState({ categories });
  }

  setTimingCategory(bmesDetail) {
    // looks for timing categories
    const activeTimingCategories = bmesDetail.included.filter(cat => Object.hasOwnProperty.call(cat, 'category_type') && cat.category_type === 'Timing');

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
    const nephewCategories = bmesDetail.included.filter(cat => Object.hasOwnProperty.call(cat, 'category_type') && cat.category_type === 'Bme');

    if (!nephewCategories.length) return;

    const nephewCategoriesIds = nephewCategories.map(cat => cat.id);

    const childrenCategoryId = nephewCategories ? nephewCategories[0].relationships.parent.data.id : {};
    const parentCategory = childrenCategoryId ? bmeCategories.find((cat) => {
      return cat.children.find(c => c.id === childrenCategoryId);
    }) : {};

    this.setState({
      categories: {
        parent: parentCategory.id,
        children: childrenCategoryId,
        nephew: nephewCategoriesIds
      }
    });
  }

  fillFields({ bmesDetail }) {
    this.setTimingCategory(bmesDetail);
    this.setEnablingConditions(bmesDetail);
  }

  render() {
    const { parent, children } = this.state.categories;
    let parentCategory = null;
    let childrenOptions = [];
    let nephewOptions = [];

    if (this.props.bmeCategories) {
      if (parent) {
        parentCategory = this.props.bmeCategories.find(cat => cat.id === this.state.categories.parent);
        childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }

      if (children) {
        const childrenCategory = parentCategory.children.find(child => child.id === this.state.categories.children);
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
          {/* categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              { /* Parent Category */}
              <Select
                name="categories"
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                validations={['required']}
                options={this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            { /* Children Category */}
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val)}
                validations={['required']}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="small-4 columns">
              { /* Nephew Category */}
              <Select
                multi
                name="categories"
                value={this.state.categories.nephew}
                onChange={val => this.onCategoryChange('nephew', val)}
                validations={['required']}
                label="Sub-sub-category"
                options={nephewOptions}
              />
            </div>
          </div>
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
          {/* description */}
          <Textarea
            name="description"
            label="Description"
            placeholder="Description"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.props.bmesDetail ? this.props.bmesDetail.description : ''}
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
