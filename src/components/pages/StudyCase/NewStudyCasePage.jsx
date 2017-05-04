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
import EntityContainer from 'components/study-case/EntityContainer';
import AddImpactForm from 'components/form/addImpactForm';
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
      bmes: [{}],
      // stores the impacts the user saves
      impacts: [AddImpactForm],
      // stores the changes produced in solution categories selectors
      solution_categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.bmeCategories.length || dispatch(getCategories({ type: 'Bme', tree: true }));
    this.props.impactCategories.length || dispatch(getCategories({ type: 'Impact', tree: true }));
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

    // TODO: REVIEW
    const data = {
      ...this.form,
      category_ids: this.state.categories.nephew ? [...this.state.categories.nephew, ...this.state.timing] : null,
      enabling_ids: this.state.enablings
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

  // onSelectChange(field, val) {
  //   this.setState({
  //     [field]: val.map(v => v.value)
  //   });
  // }

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
      categories.children = null;
      categories.nephew = null;
    }

    if (level === 'children') {
      categories.nephew = null;
    }

    this.setState({ [type]: categories });
  }

  onAddImpact() {
    const { impacts } = this.state;

    impacts.push(<addImpactForm />);
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
    //
    // const parentOptions = this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }));
    // let childrenOptions = [];
    // let nephewOptions = [];
    // let parentCategory = null;
    // let childrenCategory = null;
    //
    // if (parent) {
    //   parentCategory = this.props.bmeCategories.find(cat => cat.id === this.state.categories.parent);
    //   childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
    //
    //   if (children) {
    //     childrenCategory = parentCategory.children.find(child => child.id === this.state.categories.children);
    //     nephewOptions = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
    //   }
    // }

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
                name="driver_description"
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
                name="solution_description"
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
          <div className="row expanded">
            <EntityContainer
              items={this.state.impacts}
              maxItems={MAX_IMPACTS_PER_PAGE}
              onAdd={() => this.onAddImpact()}
            />
          </div>
        </Form>
      </section>
    );
  }
}

NewStudyCasePage.propTypes = {
  bmeCategories: PropTypes.array,
  impactCategories: PropTypes.array,
  solutionCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ categories }) => ({
  bmeCategories: categories.Bme,
  impactCategories: categories.Impact,
  solutionCategories: categories.Solution
});

export default connect(mapStateToProps, null)(NewStudyCasePage);
