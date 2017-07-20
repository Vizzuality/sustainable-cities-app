import React from 'react';
import Proptypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';
import isEqual from 'lodash/isEqual';

import { getCategories, updateCategory } from 'modules/categories';
import getCategoryDetail from 'selectors/categoryDetail';

import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';

import { CATEGORY_TYPE_CONVERSOR, CATEGORY_TYPE_SELECT } from 'constants/categories';

class EditCategoryPage extends React.Component {
  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      category_type: null,
      parent_id: null
    };

    // As 'categoryDetail' can be retrieved locally or asking for it,
    // we will keep it in a variable to keep use consistency
    this.categoryDetail = null;
  }

  /* Lifecycle */
  componentWillMount() {
    if (!this.props.categoryDetail) {
      // if we already have a list of categories, we will look for the desired one there
      if (this.props.categories.all.length) {
        const categoryDetail = this.props.categories.all.find(cat => +cat.id === +this.props.categories.detailId);

        this.categoryDetail = categoryDetail;
        this.setCategory(categoryDetail);
      } else {
        // if not, we will notify the API which one we want
        dispatch(getCategories({ type: 'detail', id: this.props.categories.detailId }));
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const currentCategoryDetails = this.props.categories.detail ? this.props.categories.detail[0] : null;
    const nextCategoryDetails = nextProps.categories.detail ? nextProps.categories.detail[0] : null;

    // if category details are equal, there's no need to do anything
    if (!isEqual(currentCategoryDetails, nextCategoryDetails)) {
      this.categoryDetail = nextCategoryDetails;
      this.setCategory(nextCategoryDetails);
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val ? val.value : null
    });
  }

  onSelectCategoryType(field, val) {
    this.onSelectChange(field, val);

    dispatch(getCategories({
      type: val.value,
      pageSize: 9999,
      sort: 'name'
    }));
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form,
      parent_id: this.state.parent_id,
      category_type: CATEGORY_TYPE_CONVERSOR.find(cat => cat.key === this.state.category_type).value
    };

    // update category
    dispatch(updateCategory({
      id: this.props.categories.detailId,
      data,
      onSuccess() {
        toastr.success('Category edited!');
      }
    }));
  }

  setCategory(categoryDetail) {
    // API type values are a bit different from the ones we use locally,
    // that's why it needs a conversion before doing anything
    const convertedCategoryType = CATEGORY_TYPE_CONVERSOR.find(cat => cat.value === categoryDetail.category_type).key;

    // gets categories by type to populate category selector
    dispatch(getCategories({
      type: convertedCategoryType,
      pageSize: 9999,
      sort: 'name'
    }));

    this.setState({
      category_type: convertedCategoryType,
      // asks for its parent to know if the category selector must be setted
      // with an option or not
      parent_id: categoryDetail.relationships.parent.data ? categoryDetail.relationships.parent.data.id : null
    });
  }

  render() {
    let categoryOption = null;
    let categoryOptions = [];
    const { label, description } = this.categoryDetail || {};

    if (this.state.category_type && this.props.categories[this.state.category_type].length) {
      const currentCategories = this.props.categories[this.state.category_type];
      categoryOptions = currentCategories.map(cat => ({ value: cat.id, label: cat.name }));
      categoryOption = currentCategories.find(cat => cat.id === this.state.parent_id);

      if (categoryOption) {
        categoryOption = categoryOption.id;
      }
    }

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/category" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="small-12 columns">
              <Select
                required
                clearable={false}
                name="category_type"
                value={this.state.category_type}
                onChange={val => this.onSelectCategoryType('category_type', val)}
                label="Category type"
                options={CATEGORY_TYPE_SELECT}
              />
            </div>
          </div>
          {/* name */}
          <Input
            type="text"
            name="name"
            label="Category name"
            placeholder="Category name"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.categoryDetail ? this.categoryDetail.name : ''}
          />
          <div className="row expanded">
            {/* category */}
            <div className="small-12 columns">
              <Select
                name="parent_id"
                value={categoryOption}
                onChange={val => this.onSelectChange('parent_id', val)}
                label="Category"
                options={categoryOptions}
              />
            </div>
          </div>
          {/* BME question */}
          {this.state.category_type === 'bme' &&
            <Input
              type="text"
              onChange={this.onInputChange}
              name="label"
              value={label || ''}
              label="Question"
              validations={['required']}
            />}
          {/* description */}
          <Textarea
            validations={[]}
            onChange={this.onInputChange}
            name="description"
            value={description || ''}
            label="Description"
          />
        </Form>
      </section>
    );
  }
}

EditCategoryPage.propTypes = {
  categories: Proptypes.object,
  categoryDetail: Proptypes.object
};

const mapStateToProps = state => ({
  categories: state.categories,
  categoryDetail: getCategoryDetail(state),
  categoryType: state.categories.categoryType
});

export default connect(mapStateToProps, null)(EditCategoryPage);
