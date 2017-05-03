import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getSolutions, updateSolution } from 'modules/solutions';
import { getCategories } from 'modules/categories';
import { Button, Form, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getSolutionDetail from 'selectors/solutionDetail';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

class EditSolutionPage extends React.Component {

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
      dispatch(getCategories({ type: 'solutions', tree: true }));

    if (!this.props.solutionDetail) {
      dispatch(getSolutions({ id: this.props.solutions.detailId }));
    }
  }

  componentDidMount() {
    if (this.props.solutionDetail) {
      this.fillFields(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.solutionCategories, nextProps.solutionCategories) &&
      this.props.solutionDetail !== undefined) {
      this.setCategories(nextProps);
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
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

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Update Enabling
    dispatch(updateSolution({
      id: this.props.solutionDetail.id,
      data: {
        ...this.form,
        category_ids: this.state.categories.nephew
      },
      onSuccess() {
        toastr.success('Solution edited!');
      }
    }));
  }

  setCategories({ solutionDetail, solutionCategories }) {
    const nephewCategories = solutionDetail.included.filter(cat => Object.hasOwnProperty.call(cat, 'category_type') && cat.category_type === 'Solution');

    if (!nephewCategories.length) return;

    const nephewCategoriesIds = nephewCategories.map(cat => cat.id);

    const childrenCategoryId = nephewCategories ? nephewCategories[0].relationships.parent.data.id : {};
    const parentCategory = childrenCategoryId ? solutionCategories.find((cat) => {
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

  render() {
    const { parent, children } = this.state.categories;
    let parentCategory = null;
    let childrenOptions = [];
    let nephewOptions = [];

    if (this.props.solutionCategories) {
      if (parent) {
        parentCategory = this.props.solutionCategories.find(sc => sc.id === this.state.categories.parent);
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
            <Link to="/solution" className="button alert">Cancel</Link>
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

EditSolutionPage.propTypes = {
  solutions: PropTypes.object,
  solutionCategories: PropTypes.object,
  solutionDetail: PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  solutions: state.solutions,
  solutionCategories: state.categories.solution,
  solutionDetail: getSolutionDetail(state)
});

export default connect(mapStateToProps, null)(EditSolutionPage);
