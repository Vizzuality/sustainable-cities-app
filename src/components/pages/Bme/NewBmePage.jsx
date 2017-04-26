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
    this.props.bmeCategories.length || dispatch(getCategories({ type: 'Bme', tree: true }));
    this.props.timingCategories.length || dispatch(getCategories({ type: 'timing' }));
    this.props.enablings.list.length || dispatch(getEnablings());
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
      category_ids: [...this.state.categories.nephew, ...this.state.timing],
      enabling_ids: this.state.enablings
    };

    // Create Bme
    dispatch(createBme({
      data,
      onSuccess: () => {
        toastr.success('Business model element created!');
      }
    }));
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value)
    });
  }

  onCategoryChange(level, id) {
    const categories = {
      ...this.state.categories,
      [level]: id
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
                onChange={val => this.onCategoryChange('parent', val.value)}
                label="Category"
                options={parentOptions}
              />
            </div>
            <div className="small-4 columns">
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val.value)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="small-4 columns">
              <Select
                multi
                name="categories"
                value={this.state.categories.nephew}
                onChange={val => this.onCategoryChange('nephew', val.map(i => i.value))}
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
  bmeCategories: categories.Bme,
  timingCategories: categories.timing
});

export default connect(mapStateToProps, null)(NewBmePage);
