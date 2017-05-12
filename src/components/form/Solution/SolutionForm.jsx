import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';

import { getCategories } from 'modules/categories';

import { Button, Form, Select } from 'components/form/Form';
import SolutionSelector from 'components/solution/SolutionSelector';

class SolutionForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      categories: {}
    };
  }

  componentWillMount() {
    dispatch(getCategories({ type: 'Solution', tree: true, pageSize: 9999, sort: 'name' }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.values) {
      const { values } = nextProps;
      this.setState({
        categories: {
          parent: values.parent,
          children: values.children,
          nephew: values.nephew
        }
      });
    }
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

  /* this is probably a temporary patch */
  getCategoryName(categoryId) {
    const solutionSelectOptions = this.loadMultiSelectOptions(this.state.categories);
    let categoryName;

    if (solutionSelectOptions.nephew) {
      categoryName = solutionSelectOptions.nephew.filter(opt => opt.value === categoryId)[0].label;
    }


    return categoryName;
  }

  @Autobind
  onSelectSolution(state) {
    this.setState({ categories: state.categories });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const { parent, children, nephew } = this.state.categories;
    const nephewName = this.getCategoryName(nephew);
    this.props.onSubmit && this.props.onSubmit({
      ...this.form,
      ...{ categories: {
        parent,
        children,
        nephew: {
          id: nephew,
          name: nephewName
        }
      } }
    });
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
      const parentId = this.state.categories.parent;
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  loadMultiSelectOptions() {
    const options = {
      children: [],
      nephew: []
    };
    const { parent, children } = this.state.categories;

    if (parent) {
      const parentCategory = this.props.solutionCategories.find(cat => cat.id === parent);
      options.children = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));

      if (children) {
        const childrenCategory = parentCategory.children.find(child => child.id === children);
        options.nephew = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

    return options;
  }


  render() {
    return (
      <div className="c-solution-form">
        <Form onSubmit={this.onSubmit}>
          <span>Solutions</span>
          <SolutionSelector
            deletable={false}
            state={this.state.categories}
            solutionCategories={this.props.solutionCategories}
            onChangeSelect={this.onSelectSolution}
          />
          <Button className="button">{this.props.text}</Button>
        </Form>
      </div>
    );
  }
}


SolutionForm.propTypes = {
  solutionCategories: PropTypes.array,
  text: PropTypes.string,
  values: PropTypes.object,
  onSubmit: PropTypes.func
};

const mapStateToProps = ({ categories }) => ({
  solutionCategories: categories.solution
});

export default connect(mapStateToProps, null)(SolutionForm);
