import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import {
  MAX_BMES_PER_PAGE,
  MAX_IMPACTS_PER_PAGE
} from 'constants/study-case';
import { createStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class NewStudyCasePage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      // stores the bmes the user saves
      bmes: [],
      // stores the impacts the user saves
      impacts: [],
      // stores the changes produced in solution categories selectors
      solution_categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.solutionCategories.length || dispatch(getCategories({ type: 'Solution', tree: true }));
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    // needs to be validated by an admin before it appears in the list
    const data = {
      ...this.form,
      category_id: this.state.solution_categories.nephew,
      project_type: 'StudyCase'
    };

    // Create study case
    dispatch(createStudyCase({
      data,
      onSuccess() {
        // Redirect to study cases list
        dispatch(push('/study-cases'));
        toastr.success('Study case created!');
      }
    }));
  }

  onCategoryChange(type, level, val) {
    if (val) {
      val = Array.isArray(val) ?
        val.map(i => i.value) : val.value;
    }

    const categories = {
      ...this.state[type],
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

    this.setState({ [type]: categories });
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
      const parentId = this.state.solution_categories.parent;
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  render() {
    // solution categories
    const solutionCategories = this.state.solution_categories;
    let solutionChildrenOptions = [];
    let solutionNephewOptions = [];

    if (solutionCategories.parent) {
      // retrieves solution options of the children selector
      const parentSolutionCategory = this.props.solutionCategories.find(cat => cat.id === solutionCategories.parent);
      if (parentSolutionCategory.children && parentSolutionCategory.children.length) {
        solutionChildrenOptions = parentSolutionCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }

      if (solutionCategories.children) {
        // retrieves solution options of the nephew selector
        const childrenCategory = parentSolutionCategory.children.find(child => child.id === solutionCategories.children);
        solutionNephewOptions = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          {/* study case name */}
          <div className="row expanded">
            <div className="small-12 columns">
              <Input
                type="text"
                onChange={this.onInputChange}
                name="name"
                value=""
                label="Study case name"
                validations={['required']}
              />
            </div>
          </div>
          {/* driver description */}
          <div className="row expanded">
            <div className="small-12 columns">
              <Textarea
                validations={[]}
                onChange={this.onInputChange}
                name="situation"
                value=""
                label="Driver description"
              />
            </div>
          </div>
          {/* solution description */}
          <div className="row expanded">
            <div className="small-12 columns">
              <Textarea
                validations={[]}
                onChange={this.onInputChange}
                name="solution"
                value=""
                label="Solution description"
              />
            </div>
          </div>
          {/* city & year */}
          <div className="row expanded">
            {/* city */}
            <div className="small-6 columns">
              <Input
                type="text"
                onChange={this.onInputChange}
                name="city_ids"
                value=""
                label="City"
                validations={['required']}
              />
            </div>
            <div className="small-6 columns">
              {/* year */}
              <Input
                type="number"
                onChange={this.onInputChange}
                name="operational_year"
                value=""
                label="Year"
                validations={['required']}
              />
            </div>
          </div>
          {/* solution categories */}
          <div className="row expanded">
            {/* parent solution category */}
            <div className="small-4 columns">
              <Select
                name="solution_categories"
                value={this.state.solution_categories.parent}
                onChange={val => this.onCategoryChange('solution_categories', 'parent', val)}
                label="Solution category"
                options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            {/* children solution category */}
            <div className="small-4 columns">
              <Select
                name="solution_categories"
                value={this.state.solution_categories.children}
                onChange={val => this.onCategoryChange('solution_categories', 'children', val)}
                label="Solution sub-category"
                options={solutionChildrenOptions}
              />
            </div>
            {/* nephew solution category */}
            <div className="small-4 columns">
              <Select
                name="solution_categories"
                value={this.state.solution_categories.nephew}
                onChange={val => this.onCategoryChange('solution_categories', 'nephew', val)}
                label="Solution sub-sub-category"
                options={solutionNephewOptions}
              />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

NewStudyCasePage.propTypes = {
  solutionCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ categories }) => ({
  solutionCategories: categories.Solution
});

export default connect(mapStateToProps, null)(NewStudyCasePage);
