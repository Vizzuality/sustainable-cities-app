import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';

import { getCategories } from 'modules/categories';

import { Button, Form } from 'components/form/Form';
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

  @Autobind
  onSelectSolution(state) {
    this.setState({ categories: state.categories });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const { parent, children, nephew } = this.state.categories;
    if (!nephew) return;
    const nephewName = this.getCategoryName(nephew);
    if (this.props.onSubmit) {
      this.props.onSubmit({
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
  }

  /* this is probably a temporary patch */
  getCategoryName(categoryId) {
    const solutionSelectOptions = this.loadMultiSelectOptions(this.state.categories);
    let categoryName;

    if (solutionSelectOptions.nephew) {
      categoryName = solutionSelectOptions.nephew.filter(opt => opt.value === categoryId);
      categoryName = categoryName ? categoryName[0].label : '-';
    }


    return categoryName;
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
