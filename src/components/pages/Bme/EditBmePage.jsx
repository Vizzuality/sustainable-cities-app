import React from 'react';
import PropTypes from 'prop-types';
import { dispatch } from 'main';
import { getBmes, updateBme } from 'modules/bmes';
import { getCategories } from 'modules/categories';
import { getEnablings } from 'modules/enablings';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import SolutionSelector from 'components/solution/SolutionSelector';
import SourceForm from 'components/sources/SourceForm';
import getBmeDetail from 'selectors/bmeDetail';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { toggleModal } from 'modules/modal';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { xhrErrorToast } from 'utils/toasts';
import DropZone from 'components/dropzone/DropZone';

// selectors
import solutionTreeSelector from 'selectors/solutionTree-bme';

import { MAX_SIZE_IMAGE } from 'constants/bmes';

class EditBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};

    this.state = {
      categories: {
        bme: {},
        // contains data from selected solutions
        solution: []
      },
      enablings: {},
      timing: {},
      external_sources_attributes: [],
      photos_attributes: [],
      documents_attributes: []
    };

    this.categoryGroups = {
      bme: props.bmeCategories
      // solution: props.solutionCategories
    };

    // contains ids from selected solutions
    this.solutionIds = [];
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getCategories({ type: 'Bme', tree: true, pageSize: 9999 }));
    dispatch(getCategories({ type: 'Solution', tree: true, pageSize: 9999 }));
    dispatch(getCategories({ type: 'timing', pageSize: 9999 }));
    dispatch(getEnablings({ pageSize: 9999 }));

    if (this.props.bmes.detailId) {
      dispatch(getBmes({ id: this.props.bmes.detailId }));
    }

    if (this.props.bmesDetail) {
      this.fillFields(this.props);
      this.setCategories(this.props);
      this.setDefaultSolutions(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { bmeCategories, bmesDetail, bmes } = this.props;
    const solutionTreeChanged = this.props.solutionTree !== nextProps.solutionTree;
    if (!isEqual(bmeCategories, nextProps.bmeCategories)) {
      this.categoryGroups = {
        ...this.categoryGroups,
        ...{ bme: nextProps.bmeCategories }
      };
    }

    // if (!isEqual(solutionCategories, nextProps.solutionCategories)) {
    //   this.categoryGroups = {
    //     ...this.categoryGroups,
    //     ...{ solution: nextProps.solutionCategories }
    //   };
    // }

    if (!isEqual(bmesDetail, nextProps.bmesDetail)) {
      this.fillFields(nextProps);
      this.setDefaultSolutions(nextProps);
    }

    if (!isEqual(bmes.included, nextProps.bmes.included)) {
      this.setDefaultSources(nextProps);

      this.setState({
        photos_attributes: nextProps.bmes.included.filter(sc => sc.type === 'photos'),
        documents_attributes: nextProps.bmes.included.filter(sc => sc.type === 'documents')
      });
    }

    // review this
    if (!isEqual(bmeCategories, nextProps.bmeCategories) &&
      this.props.bmesDetail !== undefined) {
      this.setCategories(nextProps);
    }

    if (solutionTreeChanged) {
      this.setState({
        categories: {
          ...this.state.categories,
          solution: nextProps.solutionTree
        }
      });
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value)
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const {
      categories,
      enablings,
      external_sources_attributes,
      timing,
      photos_attributes,
      documents_attributes
    } = this.state;

    const data = {
      ...this.form,
      category_ids: [
        ...timing,
        ...[categories.bme.nephew],
        ...this.solutionIds
      ],
      enabling_ids: enablings,
      // eslint-disable-next-line no-underscore-dangle
      external_sources_attributes: external_sources_attributes.filter(es => !es.id || es.edited || es._destroy),
      photos_attributes,
      documents_attributes
    };

    // Update BME
    dispatch(updateBme({
      id: this.props.bmesDetail.id,
      data,
      onSuccess: () => {
        toastr.success('Business model element edited!');
      },
      onError: xhrErrorToast
    }));
  }

  onCategoryChange(group, level, initialVal) {
    let val = initialVal;

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
      categories.nephew = val ? options.nephew : [];
    }

    if (level === 'children') {
      let options = {};
      if (val) {
        options = this.getFirstSelectOption(val, 'children', group);
      }
      categories.nephew = val ? options.nephew : [];
    }

    const newState = {
      ...this.state.categories,
      ...{ [group]: categories }
    };

    this.setState({ categories: newState });
  }

  @Autobind
  onAddSolution() {
    const solutionState = this.state.categories.solution;
    solutionState.push({
      parent: null,
      children: null,
      nephew: null
    });

    const newState = {
      ...this.state.categories,
      ...{ solution: solutionState }
    };

    this.setState({ categories: newState });
  }

  @Autobind
  onChangeSolution(values, index) {
    const solutionState = this.state.categories.solution;
    solutionState[index] = values;

    this.solutionIds[index] = values.nephew === 'all' ?
      values.children : values.nephew;

    this.setState({
      categories: {
        ...this.state.categories,
        ...{ solution: solutionState }
      }
    });
  }

  @Autobind
  onDeleteSolution(index) {
    this.solutionIds.splice(index, 1);
    const solutionState = this.state.categories.solution;
    solutionState.splice(index, 1);

    const newState = {
      ...this.state.categories,
      ...{ solution: solutionState }
    };

    this.setState({ categories: newState });
  }

  /* External sources methods */
  setDefaultSolutions({ bmesDetail }) {
    const solutionsIds = bmesDetail.categories.filter(cat => cat.category_type === 'Solution').map(c => c.id);
    this.solutionIds = solutionsIds;
  }

  setDefaultSources({ bmes }) {
    // eslint-disable-next-line camelcase
    const external_sources_attributes = bmes.included.filter(s => s.type === 'external_sources');

    this.setState({
      external_sources_attributes
    });
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

  setTimingCategory(bmesDetail) {
    // looks for timing categories
    const activeTimingCategories = bmesDetail.categories.filter(cat => cat.category_type === 'Timing');

    // retrieves their ids
    const activeTimingCategoriesIds = activeTimingCategories.map(cat => cat.id);

    this.setState({
      timing: activeTimingCategoriesIds
    });
  }

  setEnablingConditions(bmesDetail) {
    const activeEnablings = bmesDetail.relationships.enablings.data.map(en => en.id);

    this.setState({
      enablings: activeEnablings
    });
  }

  setCategories({ bmesDetail }) {
    let newState = {};
    Object.keys(this.categoryGroups).forEach((key) => {
      let nephewCategory;


      switch (key) {
        case 'bme':
          nephewCategory = bmesDetail.categories.filter(cat => cat.category_type === 'Bme')[0];
          break;
        // case 'solution':
        //   nephewCategory = bmesDetail.categories.filter(cat => cat.category_type === 'Solution');
        //   break;
        default:
          break;
      }

      // if (!nephewCategory) {
      //   newState = {
      //     ...newState.categories,
      //     ...{ [key]: [] }
      //   };
      //   return;
      // }

      let parentCategory = null;
      let childrenCategoryId = null;

      if (!Array.isArray(nephewCategory)) {
        childrenCategoryId = nephewCategory ? nephewCategory.relationships.parent.data.id : {};

        parentCategory = childrenCategoryId ? this.categoryGroups[key].find((cat) => {
          return cat.children.find(c => c.id === childrenCategoryId);
        }) : {};

        newState = {
          ...this.state.categories,
          ...{ [key]: {
            parent: parentCategory ? parentCategory.id : null,
            children: childrenCategoryId,
            nephew: nephewCategory.id
          } }
        };
      } else {
        const status = nephewCategory.map((cat) => {
          childrenCategoryId = cat.relationships.parent.data.id || {};

          parentCategory = childrenCategoryId ? this.categoryGroups[key].find((catChild) => {
            return catChild.children.find(c => c.id === childrenCategoryId);
          }) : {};

          return {
            parent: parentCategory ? parentCategory.id : null,
            children: childrenCategoryId,
            nephew: cat.id
          };
        });

        newState = {
          ...newState,
          ...newState.categories,
          ...{ [key]: status }
        };
      }
    });

    this.setState({ categories: newState });
  }

  @Autobind
  deleteSource(index) {
    const externalSources = this.props.bmes.included.filter(sc => sc.type === 'external_sources');
    const sourceToDelete = this.state.external_sources_attributes[index];

    const exists = externalSources.find(i => i.id === sourceToDelete.id);
    const { external_sources_attributes } = this.state;

    if (!exists) {
      // Source still doesn't exist on database,
      // just remove it from local array
      external_sources_attributes.splice(index, 1);
    } else {
      // Source exists on database,
      // we have to delete it from there
      external_sources_attributes[index] = {
        id: sourceToDelete.id,
        _destroy: true
      };
    }

    this.setState({ external_sources_attributes });
  }

  @Autobind
  editSource(data, index) {
    // eslint-disable-next-line camelcase
    const external_sources_attributes = this.state.external_sources_attributes.slice();
    external_sources_attributes[index] = {
      ...external_sources_attributes[index],
      ...data,
      edited: true
    };
    this.setState({ external_sources_attributes });
    dispatch(toggleModal(false));
  }

  @Autobind
  createSource(data) {
    this.setState({
      external_sources_attributes: [...this.state.external_sources_attributes, data]  // eslint-disable-line camelcase
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  showSourceForm(evt, opts = {}) {
    evt.preventDefault();
    let values = {};
    let action = this.createSource;

    if (opts.edit) {
      values = this.state.external_sources_attributes[opts.index];
      action = this.editSource;
    }

    dispatch(toggleModal(
      true,
      <SourceForm text="Add" values={values} onSubmit={(...args) => action(...args, opts.index)} />
    ));
  }

  componentWillUnMount() {
    this.solutionIds = [];
  }

  fillFields({ bmesDetail }) {
    this.setTimingCategory(bmesDetail);
    this.setEnablingConditions(bmesDetail);
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

  render() {
    const bmeSelectOptions = this.loadMultiSelectOptions(this.state.categories.bme, 'bme');

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/backoffice/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          {/* name */}
          <Input
            type="text"
            name="name"
            label="BME name"
            placeholder="Business model element title"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.props.bmesDetail ? this.props.bmesDetail.name : ''}
          />
          {/* categories */}
          <div className="row expanded">
            <div className="small-4 columns">
              { /* Parent Category */}
              <Select
                required
                name="categories"
                value={this.state.categories.bme.parent}
                onChange={val => this.onCategoryChange('bme', 'parent', val)}
                label="Category"
                options={this.props.bmeCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
            { /* Children Category */}
            <div className="small-4 columns">
              <Select
                required
                name="categories"
                value={this.state.categories.bme.children}
                onChange={val => this.onCategoryChange('bme', 'children', val)}
                label="Sub-category"
                options={bmeSelectOptions.children}
              />
            </div>
            <div className="small-4 columns">
              { /* Nephew Category */}
              <Select
                required
                name="categories"
                value={this.state.categories.bme.nephew}
                onChange={val => this.onCategoryChange('bme', 'nephew', val)}
                label="Sub-sub-category"
                options={bmeSelectOptions.nephew}
              />
            </div>
          </div>
          {/* enabling conditions */}
          <Select
            multi
            name="enablings"
            value={this.state.enablings}
            onChange={val => this.onSelectChange('enablings', val)}
            label="Enabling conditions"
            delimiter=","
            options={this.props.enablings.list.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* timing */}
          <Select
            multi
            name="timing"
            value={this.state.timing}
            onChange={val => this.onSelectChange('timing', val)}
            label="Timing"
            options={this.props.timingCategories.map(en => ({ value: en.id, label: en.name }))}
          />
          {/* Solution categories */}
          <label htmlFor="solutions">Solutions</label>
          {this.state.categories.solution.length > 0
            && this.state.categories.solution.map((sol, index) => (
              <SolutionSelector
                index={index}
                key={index} // eslint-disable-line react/no-array-index-key
                solutionCategories={this.props.solutionCategories}
                state={sol}
                mandatoryLevels={[1, 2]}
                onChangeSelect={this.onChangeSolution}
                onDeleteSelect={this.onDeleteSolution}
              />
          ))}
          <div className="button-list">
            <button type="button" className="button add" onClick={this.onAddSolution}>Add Solution</button>
          </div>
          {/* External sources */}
          <div className="button-list">
            <label htmlFor="sources">Sources</label>
            <ul>
              {this.state.external_sources_attributes.map((source, i) => {
                // eslint-disable-line no-underscore-dangle
                return (
                  <li
                    key={source.name || i}
                    className={`${source._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                    <button type="button" className="delete button" onClick={() => this.deleteSource(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
            <button type="button" className="add button" onClick={evt => this.showSourceForm(evt)}>Add source</button>
          </div>
          {/* description */}
          <Textarea
            name="description"
            label="Description"
            placeholder="Description"
            onChange={this.onInputChange}
            value={this.props.bmesDetail && this.props.bmesDetail.description ? this.props.bmesDetail.description : ''}
            validations={[]}
          />
          {/* Images */}
          <div className="row">
            <div className="column small-6">
              <DropZone
                title="Images"
                accept={'image/png, image/jpg, image/jpeg'}
                files={DropZone.defaultFileTransform(this, 'photos_attributes')}
                onDrop={DropZone.defaultDropOnEdit(this, 'photos_attributes')}
                onDelete={DropZone.defaultDeleteOnEdit(this, 'photos_attributes')}
                multiple={false}
                withImage
                maxSize={MAX_SIZE_IMAGE}
              />
            </div>
            <div className="column small-6">
              <DropZone
                title="Files"
                accept={'application/pdf, application/json, application/msword, application/excel'}
                files={DropZone.defaultFileTransform(this, 'documents_attributes')}
                onDrop={DropZone.defaultDropOnEdit(this, 'documents_attributes')}
                onDelete={DropZone.defaultDeleteOnEdit(this, 'documents_attributes')}
                multiple={false}
              />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

EditBmePage.propTypes = {
  bmes: PropTypes.object,
  bmeCategories: PropTypes.array,
  enablings: PropTypes.object,
  solutionCategories: PropTypes.array,
  timingCategories: PropTypes.array,
  // Selector
  bmesDetail: PropTypes.object,
  solutionTree: PropTypes.array
};

EditBmePage.defaultProps = {
  solutionTree: []
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  bmeCategories: state.categories.bme,
  solutionCategories: state.categories.solution,
  timingCategories: state.categories.timing,
  enablings: state.enablings,
  solutionTree: solutionTreeSelector(state),
  bmesDetail: getBmeDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
