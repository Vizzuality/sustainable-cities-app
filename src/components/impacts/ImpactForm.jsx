import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { getCategories } from 'modules/categories';
import { getExternalSources } from 'modules/external-sources';
import { Form, Input, Button, Select, Textarea } from 'components/form/Form';
import { Autobind } from 'es-decorators';

import compact from 'lodash/compact';
import difference from 'lodash/difference';


const findInTree = (node, cond) => {
  if (cond(node)) {
    return node
  } else {
    return _.compact((node.children || []).map(n => findInTree(n, cond)))[0]
  }
}

const childrenInclude = (node, childId) => {
  return (node.children || []).map(c => c.id).includes(childId)
}

const findParent = (roots, childId) => {
    return findInTree(
      {children: roots},
      n => childrenInclude(n, childId)
    )
}

const findId = (roots, id) => {
    return findInTree(
      {children: roots},
      n => n.id === id
    )
}

class ImpactForm extends React.Component {

  constructor(props, ...etc) {
    super(props, ...etc)

    this.state = {
      data: this.props.values,
    }
  }

  componentWillMount() {
    dispatch(getCategories({
      type: 'Impact',
      pageSize: 999,
      sort: 'name',
      level: 1,
      include: ['children']
    }));
    dispatch(getExternalSources({
      pageSize: 999,
    }));
  }

  componentWillReceiveProps(newProps) {
    if (!this.state.data.category && newProps.impactCategories.length) {
      this.setState({
        data: {
          category: newProps.impactCategories[0].children[0]
        }
      })
    }
  }

  onSubmit = (evt) => {
    evt.preventDefault();

    this.props.onSubmit(this.state.data);
  }

  onInputChange = (evt) => {
    this.setState({
      data: {
        ...this.state.data,
      [evt.target.name]: evt.target.value
      },
    })
  }

  onSourceChange = (values) => {
    this.setState({
      data: {
        ...this.state.data,
        externalSources: values.map(({value: id}) => this.props.externalSources.find(e => e.id === id))
      }
    })
  }

  onParentCategoryChange = ({value: id}) => {
    this.setState({
      data: {
        ...this.state.data,
        category: findId(this.props.impactCategories, id).children[0]
      }
    });
  }

  onChildCategoryChange = ({value: id}) => {
    this.setState({
      data: {
        ...this.state.data,
        category: findId(this.props.impactCategories, id)
      }
    });
  }

  render() {
    const {
      data: {
        name,
        description,
        impactValue,
        impactUnit,
        category,
      }
    } = this.state;

    if (!this.props.impactCategories.length) {
      return <span>Loading categories</span>
    }

    if (!this.props.externalSources.length) {
      return <span>Loading external sources</span>
    }

    const parentCategory = findParent(
      this.props.impactCategories,
      this.state.data.category.id,
    )

    return (
      <div className="c-impact-form">
        <Form onSubmit={this.onSubmit}>
          <span>Impacts</span>
          <div className="row expanded">
            <div className="column small-12">
              <Input
                id="name"
                label="Name"
                value={name || ''}
                type="text"
                name="name"
                validations={['required']}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-12">
              <Textarea
                name="description"
                value={description || ''}
                label="Description"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-12">
              <Select
                multi
                name="sources"
                value={this.state.data.externalSources.map(s => s.id)}
                onChange={this.onSourceChange}
                label="Sources"
                options={
                  this.props.externalSources
                    .map(e => ({value: e.id, label: e.name}))
                }
              />
            </div>
            <div className="small-6 columns">
              <Select
                name="categories"
                value={parentCategory.id}
                onChange={this.onParentCategoryChange}
                label="Category"
                options={this.props.impactCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="small-6 columns">
              <Select
                name="categories"
                value={category.id}
                onChange={this.onChildCategoryChange}
                label="Sub-category"
                options={parentCategory.children.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Value"
                value={impactValue || ''}
                name="impact_value"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                type="text"
                label="Unit"
                value={impactUnit || ''}
                name="impact_unit"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
          </div>
          <Button className="button">{this.props.text}</Button>
        </Form>
      </div>
    );
  }
}

ImpactForm.propTypes = {
  impactCategories: PropTypes.array,
  externalSources: PropTypes.array,
  sources: PropTypes.array,
  values: PropTypes.object,
  text: PropTypes.string,
  onSubmit: PropTypes.func.isRequired
};

ImpactForm.defaultProps = {
  values: {},
  sources: []
};

const mapStateToProps = ({ externalSources, categories }) => ({
  externalSources: externalSources.list,
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(ImpactForm);
