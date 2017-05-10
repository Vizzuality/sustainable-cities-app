import React from 'react';
import { dispatch } from 'main';
import { createBme } from 'modules/bmes';
import { getEnablings } from 'modules/enablings';
import { getCategories } from 'modules/categories';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

class NewBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
    this.state = {
      enablings: [],
      timing: [],
      categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.bmeCategories.length || dispatch(getCategories({ type: 'Bme', tree: true, pageSize: 9999 }));
    this.props.timingCategories.length || dispatch(getCategories({ type: 'timing', pageSize: 9999 }));
    this.props.enablings.list.length || dispatch(getEnablings({ pageSize: 9999 }));
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form,
      category_ids: [...this.state.timing, ...[this.state.categories.nephew]],
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

  getFirstSelectOption(value, source) {
    const options = {
      children: {},
      nephew: {}
    };

    if (source === 'parent') {
      // populates children selector based on parent selection
      const parentCategory = this.props.bmeCategories.find(cat => cat.id === value);
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
      const parentCategory = this.props.bmeCategories.find(cat => cat.id === parentId);
      const childrenCategory = parentCategory.children.find(child => child.id === value);
      if (childrenCategory.children && childrenCategory.children.length) {
        options.nephew = childrenCategory.children[0].id;
      }
    }

    return options;
  }

  render() {
    const { parent, children } = this.state.categories;

    const parentOptions = this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }));
    let childrenOptions = [];
    let nephewOptions = [];
    let parentCategory = null;
    let childrenCategory = null;

    if (parent) {
      parentCategory = this.props.bmeCategories.find(cat => cat.id === this.state.categories.parent);
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
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          {/* Name */}
          <Input type="text" onChange={this.onInputChange} name="name" value="" label="Business model element name" validations={['required']} />
          {/* Categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={parentOptions}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.nephew}
                onChange={val => this.onCategoryChange('nephew', val)}
                label="Sub-sub-category"
                options={nephewOptions}
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
  // State
  enablings: React.PropTypes.object,
  bmeCategories: React.PropTypes.array,
  timingCategories: React.PropTypes.array
};

// Map state to props
const mapStateToProps = ({ user, enablings, categories }) => ({
  user,
  enablings,
  bmeCategories: categories.bme,
  timingCategories: categories.timing
});

export default connect(mapStateToProps, null)(NewBmePage);
