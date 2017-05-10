import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getImpacts, updateImpact } from 'modules/impacts';
import { getCategories } from 'modules/categories';
import getImpactDetail from 'selectors/impactDetail';
import { Input, Button, Form, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

class EditImpactPage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      categories: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    this.props.impactCategories.length || dispatch(getCategories({ type: 'Impact', tree: true, pageSize: 9999 }));

    if (!this.props.impactDetail) {
      dispatch(getImpacts({ id: this.props.impacts.detailId }));
    } else {
      this.setCategories(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.impactCategories, nextProps.impactCategories) &&
      this.props.impactDetail !== undefined) {
      this.setCategories(nextProps);
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
    // Update Impact
    dispatch(updateImpact({
      id: this.props.impactDetail.id,
      data: {
        ...this.form,
        category_id: this.state.categories.children
      },
      onSuccess() {
        toastr.success('Impact edited!');
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
      categories.children = this.loadFirstChildrenOption(val);
    }

    this.setState({ categories });
  }

  setCategories({ impactDetail, impactCategories }) {
    const childrenCategoryId = impactDetail.category;

    if (!childrenCategoryId) return;

    const parentCategory = childrenCategoryId ? impactCategories.find((cat) => {
      return cat.children.find(c => c.id === childrenCategoryId);
    }) : {};

    this.setState({
      categories: {
        parent: parentCategory ? parentCategory.id : null,
        children: childrenCategoryId
      }
    });
  }

  loadFirstChildrenOption(parentId) {
    const parentCategory = this.props.impactCategories.find(cat => cat.id === parentId);
    return parentCategory.children ? parentCategory.children[0].id : null;
  }

  render() {
    const { parent } = this.state.categories;

    const parentOptions = this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }));
    let childrenOptions = [];
    let parentCategory = null;

    if (parent) {
      parentCategory = this.props.impactCategories.find(cat => cat.id === this.state.categories.parent);
      childrenOptions = parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }));
    }

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/impact" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          {/* Categories */}
          <div className="row expanded">
            <div className="small-6 columns">
              {/* parent category */}
              <Select
                name="categories"
                value={this.state.categories.parent}
                onChange={val => this.onCategoryChange('parent', val)}
                label="Category"
                options={parentOptions}
              />
            </div>
            <div className="small-6 columns">
              {/* children category */}
              <Select
                name="categories"
                value={this.state.categories.children}
                onChange={val => this.onCategoryChange('children', val)}
                label="Sub-category"
                options={childrenOptions}
              />
            </div>
            <div className="small-12 columns">
              {/* name */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="name" value={this.props.impactDetail ? this.props.impactDetail.name : ''}
                label="Impact name"
                validations={['required']}
              />
            </div>
            <div className="small-6 columns">
              {/* unit */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="impact_unit"
                value={this.props.impactDetail ? this.props.impactDetail.impact_unit : ''}
                label="Unit"
                validations={['required']}
              />
            </div>
            <div className="small-6 columns">
              {/* value */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="impact_value"
                value={this.props.impactDetail ? this.props.impactDetail.impact_value : ''}
                label="Value"
                validations={['required']}
              />
            </div>
            {/* TODO: add source */}
          </div>
        </Form>
      </section>
    );
  }
}

EditImpactPage.propTypes = {
  impacts: PropTypes.object,
  impactCategories: PropTypes.array,
  impactDetail: PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  impacts: state.impacts,
  impactCategories: state.categories.Impact,
  impactDetail: getImpactDetail(state)
});

export default connect(mapStateToProps, null)(EditImpactPage);
