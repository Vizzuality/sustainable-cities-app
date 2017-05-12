import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { toastr } from 'react-redux-toastr';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { dispatch } from 'main';

import { createCategory, getCategories } from 'modules/categories';

import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';

import { CATEGORY_TYPE_CONVERSOR, CATEGORY_TYPE_SELECT } from 'constants/categories';

class NewCategoryPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      category_type: null,
      parent_id: null
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
      category_type: CATEGORY_TYPE_CONVERSOR.find(cat => cat.key === this.state.category_type).value,
      parent_id: this.state.parent_id
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

  renderForm() {
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
          <Input type="text" onChange={this.onInputChange} name="label" value="" label="Question" validations={['required']} />}
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
            <Link to="/category" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="small-12 columns">
              {/* name */}
              <Input type="text" onChange={this.onInputChange} name="name" value="" label="Category name" validations={['required']} />
              <Select
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
