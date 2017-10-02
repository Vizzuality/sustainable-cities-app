import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { Input, Form, Button, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { createStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { getBmes } from 'modules/bmes';
import { dispatch } from 'main';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { push } from 'react-router-redux';
import Creator from 'components/creator/Creator';
import DropZone from 'components/dropzone/DropZone';
import CitySearch from 'components/cities/CitySearch';
import ImpactForm from 'components/impacts/ImpactForm';
import SourceForm from 'components/sources/SourceForm';
import { toggleModal } from 'modules/modal';
import SolutionSelector from 'components/solution/SolutionSelector';

import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/study-case';

class NewStudyCasePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      category_id: null,
      city: {},
      bmes: [],
      photos_attributes: [],
      documents_attributes: [],
      impacts_attributes: [],
      external_sources_attributes: [],
      total_images: 0
    };

    this.form = {
      project_type: 'StudyCase'
    };
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getCategories({ type: 'Solution', tree: true }));
    dispatch(getCategories({ type: 'impact' }));
    dispatch(getBmes({
      pageSize: 9999,
      pageNumber: 1
    }));
  }

  /* Event handlers */
  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const {
      bmes,
      city,
      photos_attributes,
      documents_attributes,
      solution,
      impacts_attributes,
      external_sources_attributes
    } = this.state;

    const { parent, children, nephew } = solution || {};
    const categoryId = (nephew === 'all' ? null : nephew) || children || parent;

    const { operational_year } = this.form;
    delete this.form.operational_year;
    const operationalDate = new Date();
    operationalDate.setYear(operational_year);


    // removes unnecessary params
    // eslint-disable-next-line camelcase
    if (impacts_attributes) {
      // eslint-disable-next-line no-param-reassign
      impacts_attributes.forEach((imp) => { delete imp.category_parent_id; });
    }

    dispatch(createStudyCase({
      data: {
        ...this.form,
        category_id: categoryId,
        photos_attributes,
        documents_attributes,
        impacts_attributes,
        project_bmes_attributes: bmes.map(pBme => ({
          bme_id: pBme.bme_id,
          description: pBme.description,
          is_featured: pBme.is_featured
        })),
        external_sources_attributes,
        city_ids: [city.value],
        operational_year: operationalDate
      },
      onSuccess() {
        dispatch(push('/study-cases'));
        toastr.success('Study case created!');
      }
    }));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onImpactCreate(form) {
    this.setState({
      impacts_attributes: [...this.state.impacts_attributes, form]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  onImpactEdit(form, index) {
    // eslint-disable-next-line camelcase
    const impacts_attributes = this.state.impacts_attributes.slice();
    impacts_attributes[index] = {
      ...impacts_attributes[index],
      ...form
    };
    this.setState({ impacts_attributes });
    dispatch(toggleModal(false));
  }

  /* Sources methods */
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

  @Autobind
  createSource(form) {
    this.setState({
      external_sources_attributes: [...this.state.external_sources_attributes, form]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  editSource(form, index) {
    // eslint-disable-next-line camelcase
    const external_sources_attributes = this.state.external_sources_attributes.slice();
    external_sources_attributes[index] = {
      ...external_sources_attributes[index],
      ...form
    };
    this.setState({ external_sources_attributes });
    dispatch(toggleModal(false));
  }

  @Autobind
  deleteSource(index) {
    const { external_sources_attributes } = this.state;
    external_sources_attributes.splice(index, 1);
    this.setState({ external_sources_attributes });
  }

  /* Impactc methods */
  @Autobind
  showImpactForm(evt, opts = {}) {
    evt.preventDefault();
    let values = {};
    let action = this.onImpactCreate;

    if (opts.edit) {
      values = this.state.impacts_attributes[opts.index];
      action = this.onImpactEdit;
    }

    dispatch(toggleModal(
      true,
      <ImpactForm
        text="Add"
        values={values}
        showSources={false}
        sources={this.state.external_sources_attributes.map((source, i) => ({ id: i, name: source.name }))}
        onSubmit={(...args) => action(...args, opts.index)}
      />
    ));
  }

  @Autobind
  deleteImpact(index) {
    const { impacts_attributes } = this.state;
    impacts_attributes.splice(index, 1);
    this.setState({ impacts_attributes });
  }

  /* ProjectBmes methods */
  @Autobind
  addProjectBme(bme, index) {
    let bmes;

    if (!index) {
      bmes = [
        ...this.state.bmes,
        { ...bme,
          index: this.state.bmes.length
        }
      ];
    // edits
    } else {
      bmes = this.state.bmes.slice();
      bmes[index] = {
        ...bmes[index],
        ...bme
      };
    }

    this.setState({ bmes });
  }

  @Autobind
  deleteProjectBme(index) {
    const bmes = this.state.bmes.slice();
    bmes.splice(index, 1);
    this.setState({ bmes });
  }

  /* Render */
  render() {
    return (
      <div className="c-sc-new">
        <Form onSubmit={this.onSubmit}>
          {/* Submit buttons */}
          <BtnGroup>
            <Button className="button success" type="submit">Save</Button>
            <Link className="button alert" to="/study-cases">Cancel</Link>
          </BtnGroup>
          {/* Name */}
          <Input
            type="text"
            value=""
            name="name"
            onChange={this.onInputChange}
            label="Study case title"
            validations={['required']}
          />
          {/* Tagline */}
          <Input
            type="text"
            value=""
            name="tagline"
            onChange={this.onInputChange}
            label="Tagline"
            validations={[]}
          />

          {/* Solution category */}
          <SolutionSelector
            index={0}
            state={this.state.solution}
            solutionCategories={this.props.categories.solution}
            onChangeSelect={solution => this.setState({ solution })}
            mandatoryLevels={[1, 2]}
            deletable={false}
          />
          <div className="row expanded">
            <div className="column small-6">
              {/* City */}
              <CitySearch
                name="city"
                label="City"
                validations={['required']}
                value={this.state.city}
                onChange={city => this.setState({ city })}
              />
            </div>
            <div className="column small-6">
              {/* Year */}
              <Input
                type="number"
                value=""
                name="operational_year"
                onChange={this.onInputChange}
                label="Year"
                validations={['required']}
              />
            </div>
          </div>
          <Textarea validations={[]} onChange={this.onInputChange} label="Solution" name="solution" />
          <Textarea validations={[]} onChange={this.onInputChange} label="Situation" name="situation" />
          <Creator
            title="BMEs"
            options={this.props.bmes.map(bme => ({ label: bme.name, value: bme.id, is_featured: bme.is_featured }))}
            items={this.state.bmes}
            onAdd={this.addProjectBme}
            onEdit={(...args) => this.editProjectBme(...args)}
            onDelete={this.deleteProjectBme}
          />
          {/* Sources */}
          <div className="button-list">
            <button type="button" className="add button" onClick={this.showSourceForm}>Add Source</button>
            {this.state.external_sources_attributes.map((source, i) => {
              return (
                <li key={source.name}>
                  <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                  <button className="delete button" onClick={() => this.deleteSource(i)}>Delete</button>
                </li>
              );
            })}
          </div>
          {/* Impacts */}
          <div className="button-list">
            <button type="button" className="add button" onClick={this.showImpactForm}>Add Impact</button>
            <ul>
              {this.state.impacts_attributes.map((impact, i) => {
                return (
                  <li key={impact.name}>
                    <button onClick={evt => this.showImpactForm(evt, { edit: true, index: i })}>{impact.name}</button>
                    <button className="delete button" onClick={() => this.deleteImpact(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="row expanded">
            <div className="column small-6">
              <DropZone
                title="Images"
                accept={'image/png, image/jpg, image/jpeg'}
                files={this.state.photos_attributes}
                onDrop={DropZone.defaultDropOnNew(this, 'photos_attributes', MAX_IMAGES_ACCEPTED)}
                onDelete={DropZone.defaultDeleteOnNew(this, 'photos_attributes')}
                withImage
                multiple={false}
                maxSize={MAX_SIZE_IMAGE}
              />
            </div>
            <div className="column small-6">
              <DropZone
                title="Files"
                files={this.state.documents_attributes}
                accept={'application/pdf, application/json, application/msword, application/excel'}
                onDrop={DropZone.defaultDropOnNew(this, 'documents_attributes', MAX_IMAGES_ACCEPTED)}
                onDelete={DropZone.defaultDeleteOnNew(this, 'documents_attributes')}
                multiple={false}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

// Map state to props
const mapStateToProps = ({ categories, bmes }) => ({
  categories,
  bmes: bmes.list
});

NewStudyCasePage.defaultProps = {
  bmes: []
};

NewStudyCasePage.propTypes = {
  categories: PropTypes.shape({
    impact: PropTypes.array,
    solution: PropTypes.array
  }).isRequired,
  bmes: PropTypes.array
};

export default connect(mapStateToProps, null)(NewStudyCasePage);
