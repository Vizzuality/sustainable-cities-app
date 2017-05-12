import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { createBme } from 'modules/bmes';
import { getEnablings } from 'modules/enablings';
import { getCategories } from 'modules/categories';
import { toggleModal } from 'modules/modal';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import SolutionForm from 'components/form/Solution/SolutionForm';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import isEqual from 'lodash/isEqual';

class NewBmePage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      enablings: [],
      timing: [],
      categories: {
        bme: {}
      },
      solutions: []
    };

    this.categoryGroups = {
      bme: props.bmeCategories,
      solution: props.solutionCategories
    };
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getCategories({ type: 'Bme', tree: true, pageSize: 9999 }));
    dispatch(getCategories({ type: 'Solution', tree: true, pageSize: 9999, sort: 'name' }));
    dispatch(getCategories({ type: 'timing', pageSize: 9999 }));
    dispatch(getEnablings({ pageSize: 9999 }));
  }

  componentWillReceiveProps(nextProps) {
    const { bmeCategories, solutionCategories } = this.props;
    if (!isEqual(bmeCategories, nextProps.bmeCategories)) {
      this.categoryGroups = {
        ...this.categoryGroups,
        ...{ bme: nextProps.bmeCategories }
      };
    }

    if (!isEqual(solutionCategories, nextProps.solutionCategories)) {
      this.categoryGroups = {
        ...this.categoryGroups,
        ...{ solution: nextProps.solutionCategories }
      };
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const solutions = this.state.solutions.map(solution => solution.nephew.id);

    const data = {
      ...this.form,
      category_ids: [
        ...this.state.timing,
        ...[this.state.categories.bme.nephew],
        ...solutions
      ],
      enabling_ids: this.state.enablings
    };

    // Create Bme
    dispatch(createBme({
      data,
      onSuccess() {
        // Redirect to bme list
        dispatch(push('/business-model-element'));
        toastr.success('Business model element created!');
      }
    }));
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value)
    });
  }

  onCategoryChange(group, level, val) {
    if (val) {
      val = Array.isArray(val) ?
        val.map(i => i.value) : val.value;
    }

    const categories = {
      ...this.state.categories[group],
      [level]: val
    };

    if (level === 'parent') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'parent', group);
      }
      categories.children = val ? options.children : {};
      categories.nephew = val ? options.nephew : {};
    }

    if (level === 'children') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'children', group);
      }
      categories.nephew = val ? options.nephew : {};
    }

    const newState = {
      ...this.state.categories,
      ...{ [group]: categories }
    };

    this.setState({ categories: newState });
  }

  @Autobind
  onCreateSolution(formParams) {
    this.setState({
      solutions: [...this.state.solutions, formParams.categories]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  onAddSolution(evt, opts) {
    evt.preventDefault();
    let values = {};
    let action = this.onCreateSolution;

    if (opts.edit) {
      values = this.state.solutions[opts.index];
      action = this.onEditSolution;
    }

    dispatch(toggleModal(true, <SolutionForm text="Add Solution" values={values} onSubmit={(...args) => action(...args, opts.index)} />));
  }

  @Autobind
  onEditSolution(form, index) {
    const solutions = this.state.solutions.slice();
    solutions[index] = {
      ...solutions[index],
      ...form.categories
    };

    this.setState({ solutions });
    dispatch(toggleModal(false));
  }

  getFirstSelectOption(value, source, categoryGroupId) {
    const options = {
      children: {},
      nephew: {}
    };

    if (!this.categoryGroups[categoryGroupId]) return {};

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === value);
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
      const parentId = this.state.categories[categoryGroupId].parent;
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  loadMultiSelectOptions(categoryState, categoryGroupId) {
    const options = {
      children: [],
      nephew: []
    };
    const { parent, children } = categoryState;

    if (!this.categoryGroups[categoryGroupId]) return {};

    if (parent) {
      const parentCategory = this.categoryGroups[categoryGroupId].find(cat => cat.id === parent);
      options.children = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));

      if (children) {
        const childrenCategory = parentCategory.children.find(child => child.id === children);
        options.nephew = childrenCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
      }
    }

    return options;
  }

  @Autobind
  deleteSolution(index) {
    const { solutions } = this.state;
    solutions.splice(index, 1);
    this.setState({ solutions });
  }

  render() {
    const bmeSelectOptions = this.loadMultiSelectOptions(this.state.categories.bme, 'bme');

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          {/* Name */}
          <Input type="text" onChange={this.onInputChange} name="name" value="" label="Business model element name" validations={['required']} />
          {/* BME categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.bme.parent}
                onChange={val => this.onCategoryChange('bme', 'parent', val)}
                label="Category"
                options={this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.bme.children}
                onChange={val => this.onCategoryChange('bme', 'children', val)}
                label="Sub-category"
                options={bmeSelectOptions.children}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.bme.nephew}
                onChange={val => this.onCategoryChange('bme', 'nephew', val)}
                label="Sub-sub-category"
                options={bmeSelectOptions.nephew}
              />
            </div>
          </div>
          {/* Enabling conditions */}
          <Select
            multi
            name="enablings"
            value={this.state.enablings}
            onChange={val => this.onSelectChange('enablings', val)}
            label="Enabling conditions"
            delimiter=","
            options={this.props.enablings.list.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* Timing */}
          <Select
            multi
            name="timing"
            value={this.state.timing}
            onChange={val => this.onSelectChange('timing', val)}
            label="Timing"
            options={this.props.timingCategories.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* Solutions */}
          <div className="row expanded">
            <div className="small-12 column">
              <label htmlFor="solutions">Solutions</label>
              <button type="button" className="button" onClick={this.onAddSolution}>Add Solution</button>
              <ul>
                {this.state.solutions.map((solution, i) => {
                  return (
                    <li key={i}>
                      <span onClick={evt => this.onAddSolution(evt, { edit: true, index: i })}>{`${solution.nephew.name} - ${solution.nephew.id}`}</span>
                      <button className="button" onClick={() => this.deleteSolution(i)}>Delete solution</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <Textarea
            validations={[]}
            onChange={this.onInputChange}
            name="description"
            value=""
            label="Description"
          />
        </Form>
      </section>
    );
  }
}

NewBmePage.propTypes = {
  enablings: PropTypes.object,
  bmeCategories: PropTypes.array,
  solutionCategories: PropTypes.array,
  timingCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ enablings, categories }) => ({
  enablings,
  bmeCategories: categories.bme,
  solutionCategories: categories.solution,
  timingCategories: categories.timing
});

export default connect(mapStateToProps, null)(NewBmePage);
