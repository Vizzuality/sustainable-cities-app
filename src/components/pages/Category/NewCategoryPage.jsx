import React from 'react';
import Proptypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';

import { createCategory, getCategories } from 'modules/categories';

import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import SolutionSelector from 'components/solution/SolutionSelector';

import { CATEGORY_TYPE_CONVERSOR, CATEGORY_TYPE_SELECT } from 'constants/categories';

class NewCategoryPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      category_type: null,
      parent_id: null,
      solution: {}
    };
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.value
    });
  }

  onSelectCategoryType(field, val) {
    this.onSelectChange(field, val);
    const categoryType = val.value;
    const isSolution = categoryType === 'solution';

    dispatch(getCategories({
      type: isSolution ? 'Solution' : categoryType,
      pageSize: 9999,
      sort: 'name',
      ...isSolution && { tree: true }
    }));
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const { solution, category_type, parent_id } = this.state;
    const isSolution = category_type === 'solution';
    const { parent, children } = solution || {};
    let parentId = null;

    if (isSolution) {
      if (children) {
        parentId = children === 'all' ? parent : children;
      }

      if (parent && !children) {
        parentId = parent === 'all' ? {} : parent;
      }
    } else {
      parentId = parent_id;
    }

    const data = {
      ...this.form,
      category_type: CATEGORY_TYPE_CONVERSOR.find(cat => cat.key === this.state.category_type).value,
      parent_id: parentId
    };

    // Create category
    dispatch(createCategory({
      data,
      onSuccess() {
        // Redirect to categories list
        dispatch(push('/category'));
        toastr.success('Category created!');
      }
    }));
  }

  onChangeSolution = (solution) => {
    const { nephew } = solution || {};

    this.setState({
      parent_id: nephew,
      solution
    });
  }

  renderForm() {
    const { category_type } = this.state;

    if (!category_type) return null;

    if (category_type === 'solution') {
      return (
        <SolutionSelector
          index={0}
          state={this.state.solution}
          solutionCategories={this.props.categories.solution}
          onChangeSelect={this.onChangeSolution}
          hideSubCategory
          deletable={false}
        />
      );
    }

    return (
      <div>
        <div className="row expanded">
          {/* category */}
          <div className="small-12 columns">
            <Select
              name="parent_id"
              value={this.state.parent_id}
              onChange={val => this.onSelectChange('parent_id', val)}
              label="Parent category"
              options={this.props.categories[this.state.category_type].map(cat => ({ value: cat.id, label: cat.name }))}
            />
          </div>
        </div>
        {/* BME question */}
        {this.state.category_type === 'bme' &&
          <Input
            type="text"
            onChange={this.onInputChange}
            name="label"
            value=""
            label="Question"
            validations={[]}
          />}
        {/* description */}
        <Textarea
          validations={[]}
          onChange={this.onInputChange}
          name="description"
          value=""
          label="Description"
        />
      </div>);
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/backoffice/category" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="small-12 columns">
              {/* name */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="name"
                value=""
                label="Category name"
                validations={['required']}
              />
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
          {this.state.category_type && this.renderForm()}
        </Form>
      </section>
    );
  }
}

NewCategoryPage.propTypes = {
  categories: Proptypes.object
};


const mapStateToProps = ({ categories }) => ({
  categories
});

export default connect(mapStateToProps, null)(NewCategoryPage);
