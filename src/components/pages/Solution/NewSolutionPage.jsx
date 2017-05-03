import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { createSolution } from 'modules/solutions';
import { Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

class NewSolutionPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.solutionCategories.length ||
      dispatch(getCategories({ type: 'solution', tree: true }));
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      category_ids: this.state.categories.nephew
    };

    // Create Bme
    dispatch(createSolution({
      data,
      onSuccess: () => {
        toastr.success('Business model element created!');
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

  render() {
    const { parent, children } = this.state.categories;
    let childrenOptions = [];
    let nephewOptions = [];
    let parentCategory = null;
    let childrenCategory = null;

    if (parent) {
      parentCategory = this.props.solutionCategories.find(sc => sc.id === this.state.categories.parent);
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
            <Link to="/solution" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
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
                options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
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
        </Form>
      </section>
    );
  }
}

NewSolutionPage.propTypes = {
  solutionCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ categories }) => ({
  solutionCategories: categories.solution
});

export default connect(mapStateToProps, null)(NewSolutionPage);
