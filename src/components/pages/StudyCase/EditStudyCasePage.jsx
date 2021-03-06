import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase, deleteStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { getBmes } from 'modules/bmes';
import PropTypes from 'prop-types';
import { Form, Button, Input, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import DropZone from 'components/dropzone/DropZone';
import CitySearch from 'components/cities/CitySearch';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import { push } from 'react-router-redux';
import Creator from 'components/creator/Creator';
import ImpactForm from 'components/impacts/ImpactForm';
import SourceForm from 'components/sources/SourceForm';
import SolutionSelector from 'components/solution/SolutionSelector';


// selectors
import solutionTreeSelector from 'selectors/solutionTree-studyCase';

// constants
import { MAX_SIZE_IMAGE } from 'constants/study-case';

class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);

    this.form = {
      project_type: 'StudyCase'
    };

    this.state = {
      solutionTree: {},
      city: {},
      project_bmes_attributes: [],
      impacts_attributes: [],
      external_sources_attributes: [],
      photos_attributes: [],
      documents_attributes: []
    };
  }

  componentWillMount() {
    dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
    dispatch(getCategories({ type: 'Solution', tree: true }));
    dispatch(getBmes({ pageSize: 9999, pageNumber: 1 }));
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    const studyCaseDetailChanged = this.props.studyCaseDetail !== nextProps.studyCaseDetail;
    const solutionTreeChanged = this.props.solutionTree !== nextProps.solutionTree;
    // Includes arrived! So, we can populate sub-entities
    if ((!this.props.studyCases.included || !this.props.studyCases.included.length)
      && (nextProps.studyCases.included && nextProps.studyCases.included.length)) {
      this.setState({
        city: nextProps.studyCases.included
          .filter(sc => sc.type === 'cities')
          .map(c => ({ label: c.name, value: c.id }))[0],
        project_bmes_attributes: nextProps.studyCases.included
          .filter(sc => sc.type === 'project_bmes')
          .filter(pBme => !!pBme.relationships.bme.data)
          .map((pBme, index) => ({
            id: pBme.id,
            bme_id: pBme.relationships.bme.data.id,
            description: pBme.description,
            is_featured: pBme.is_featured,
            index
          })),
        impacts_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'impacts'),
        external_sources_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'external_sources'),
        photos_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'photos'),
        documents_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'documents')
      });
    }

    if (studyCaseDetailChanged) {
      const { name, tagline, operational_year, solution, situation } = nextProps.studyCaseDetail;
      const category_id = `${nextProps.studyCaseDetail.category_id}`; // eslint-disable-line camelcase
      this.setState({
        name,
        tagline,
        category_id,
        solution,
        situation,
        operational_year: (
          operational_year // eslint-disable-line camelcase
          ? new Date(operational_year).getFullYear()
          : undefined
        )
      });
    }

    if (solutionTreeChanged) {
      this.setState({
        solutionTree: nextProps.solutionTree
      });
    }
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
    this.setState(this.form);
  }

  @Autobind
  onImpactCreate(form) {
    this.setState({
      impacts_attributes: [...this.state.impacts_attributes, form]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  onImpactEdit(data, index) {
    const impacts_attributes = this.state.impacts_attributes.slice(); // eslint-disable-line camelcase
    impacts_attributes[index] = {
      ...impacts_attributes[index],
      ...data,
      edited: true
    };
    this.setState({ impacts_attributes });
    dispatch(toggleModal(false));
  }

  @Autobind
  deleteProjectBme(index) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = this.state.project_bmes_attributes.slice();
    const bmeToDelete = project_bmes_attributes[index];

    if (!bmeToDelete.id) {
      // Bme still doesn't exist on database,
      // just remove it from local array
      project_bmes_attributes.splice(index, 1);
    } else {
      // Bme exists on database,
      // we have to delete it from there using rails way (_destroy: true)
      project_bmes_attributes[index] = {
        id: bmeToDelete.id,
        _destroy: true
      };
    }

    this.setState({ project_bmes_attributes });
  }

  @Autobind
  editProjectBme(data, index) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = this.state.project_bmes_attributes.slice();
    project_bmes_attributes[index] = {
      ...project_bmes_attributes[index],
      ...data
    };

    if (project_bmes_attributes[index].id) {
      project_bmes_attributes[index].edited = true;
    }

    this.setState({ project_bmes_attributes });
  }

  @Autobind
  addProjectBme(bme, index) {
    let bmes;

    if (!index && index !== 0) {
      bmes = [
        ...this.state.project_bmes_attributes,
        { ...bme,
          index: this.state.project_bmes_attributes.length
        }
      ];
    // edits
    } else {
      bmes = this.state.project_bmes_attributes.slice();
      bmes[index] = {
        ...bmes[index],
        ...bme,
        edited: true
      };
    }

    this.setState({ project_bmes_attributes: bmes });
  }

  @Autobind
  deleteSource(index) {
    // retrieves sources of the project
    const externalSources = this.props.studyCases.included.filter(sc => sc.type === 'external_sources');
    const { external_sources_attributes } = this.state;

    // selects source will be deleted
    const sourceToDelete = external_sources_attributes[index];

    // check if exists in API
    const exists = externalSources.find(i => i.id === sourceToDelete.id);

    if (!exists) {
      // Source still doesn't exist on API, just remove it from local array
      external_sources_attributes.splice(index, 1);
    } else {
      // Source exists on API, we have to delete it from there
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
      external_sources_attributes: [...this.state.external_sources_attributes, data]
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

  @Autobind
  deleteImpact(index) {
    const impacts = this.props.studyCases.included.filter(sc => sc.type === 'impacts');
    const impactToDelete = this.state.impacts_attributes[index];

    const exists = impacts.find(i => i.id === impactToDelete.id);
    const { impacts_attributes } = this.state;

    if (!exists) {
      // Impact still doesn't exist on database,
      // just remove it from local array
      impacts_attributes.splice(index, 1);
    } else {
      // Impact exists on database,
      // we have to delete it from there
      impacts_attributes[index] = {
        id: impactToDelete.id,
        _destroy: true
      };
    }

    this.setState({ impacts_attributes });
  }

  @Autobind
  showImpactForm(evt, opts = {}) {
    evt.preventDefault();
    const action = opts.edit ? this.onImpactEdit : this.onImpactCreate;
    let values = {};
    const { external_sources_attributes } = this.state;

    if (opts.edit) {
      values = this.state.impacts_attributes[opts.index];

      if (values.external_sources_ids) {
        values.external_sources_ids = values.external_sources_ids || [];
      } else {
        values.external_sources_ids = values.relationships.external_sources ?
          values.relationships.external_sources.data.map(source => source.id) : [];
      }
    }

    if (Object.keys(values).length) {
      // assigns children category id to values
      values.category_id =
        values.category_id
        || (values.relationships && values.relationships.category && values.relationships.category.data.id);
    }

    dispatch(toggleModal(
      true,
      <ImpactForm
        text="Add"
        values={values}
        sources={
          external_sources_attributes
            .filter(s => !s._destroy && s.id) // eslint-disable-line no-underscore-dangle
            .map((source, i) => ({ index: i, id: source.id, name: source.name }))
        }
        onSubmit={(...args) => action(...args, opts.index)}
      />
    ));
  }

  delete() {
    const { id } = this.props.studyCaseDetail;
    dispatch(deleteStudyCase({
      id,
      onSuccess() {
        toastr.success('The study case has been deleted');
        dispatch(push('/study-cases'));
      }
    }));
  }

  @Autobind
  showDeleteModal() {
    const confirm = <Confirm text={'This study case will be deleted. Are you sure?'} onAccept={() => this.delete()} />;
    dispatch(toggleModal(true, confirm));
  }

  @Autobind
  submit(evt) {
    evt.preventDefault();

    const {
      city,
      solutionTree,
      impacts_attributes,
      project_bmes_attributes,
      external_sources_attributes,
      operational_year,
      photos_attributes,
      documents_attributes
    } = this.state;

    const { parent, children, nephew } = solutionTree || {};
    const categoryId = (nephew === 'all' ? null : nephew) || children || parent;

    // eslint-disable-next-line camelcase
    if (impacts_attributes) {
      // TODO this is confusing and hard to track. I'm not sure if this mutation
      // is needed for other parts of the code when setState kicks in.
      // eslint-disable-next-line no-param-reassign
      impacts_attributes.forEach((o => delete o.relationships));
    }

    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        city_ids: city && city.value ? [city.value] : [],
        category_id: categoryId,
        // eslint-disable-next-line no-underscore-dangle
        impacts_attributes,
        // eslint-disable-next-line no-underscore-dangle
        project_bmes_attributes: project_bmes_attributes // eslint-disable-next-line no-underscore-dangle
          .filter(pbme => !pbme.id || pbme.edited || pbme._destroy)
          .map(bme => ({
            ...bme,
            bme_id: bme.bme_id
          })),
        // eslint-disable-next-line no-underscore-dangle
        external_sources_attributes,
        operational_year: new Date(this.form.operational_year
          || operational_year, 0, 2), // eslint-disable-line camelcase
        photos_attributes,
        documents_attributes
      },
      onSuccess: () => {
        toastr.success('The study case has been edited');
        // updates detail after editing
        dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
      }
    }));
  }

  render() {
    const { name, city, tagline, operational_year, solution, solutionTree, situation } = this.state;

    return (
      <div className="c-sc-edit">
        <Form onSubmit={this.submit}>
          <BtnGroup>
            <Button type="submit" className="button success">Edit</Button>
            <button type="button" className="button alert" onClick={this.showDeleteModal}>Delete</button>
            <Link to="/backoffice/study-cases" className="button">Cancel</Link>
          </BtnGroup>
          {/* Name */}
          <Input
            type="text"
            name="name"
            value={name || ''}
            label="Study case title"
            validations={['required']}
            onChange={this.onInputChange}
          />
          {/* Tagline */}
          <Input
            type="text"
            value={tagline || ''}
            name="tagline"
            onChange={this.onInputChange}
            label="Tagline"
            validations={[]}
          />
          <div className="row expanded">
            <div className="column small-6">
              {/* City */}
              <CitySearch
                name="city_ids"
                label="City"
                value={city}
                onChange={c => this.setState({ city: c })}
              />
            </div>
            <div className="column small-6">
              {/* Year */}
              <Input
                type="number"
                value={operational_year || ''}  // eslint-disable-line camelcase
                name="operational_year"
                onChange={this.onInputChange}
                label="Year"
                validations={['required']}
              />
            </div>
          </div>
          {/* Solution category */}
          <SolutionSelector
            index={0}
            state={solutionTree}
            solutionCategories={this.props.solutionCategories}
            onChangeSelect={sol => this.setState({ solutionTree: sol })}
            mandatoryLevels={[1, 2]}
            deletable={false}
          />
          <Textarea
            name="solution"
            value={solution || ''}
            label="Solution"
            validations={[]}
            onChange={this.onInputChange}
          />
          <Textarea
            name="situation"
            value={situation !== null ? situation : ''}
            label="situation"
            validations={[]}
            onChange={this.onInputChange}
          />
          <Creator
            title="BMEs"
            onAdd={this.addProjectBme}
            onEdit={this.editProjectBme}
            options={this.props.bmes.map(bme => ({ label: bme.name, value: bme.id, is_featured: bme.is_featured }))}
            items={this.state.project_bmes_attributes}
            onDelete={this.deleteProjectBme}
            selectedField="bme_id"
          />
          {/* Sources */}
          <div className="button-list">
            <button type="button" className="add button" onClick={this.showSourceForm}>Add source</button>
            <ul>
              {this.state.external_sources_attributes.map((source, i) => {
                return (
                  <li
                    // eslint-disable-next-line react/no-array-index-key
                    key={`${source.name}-${i}`}
                    className={`${source._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                    <button type="button" className="delete button" onClick={() => this.deleteSource(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Impacts */}
          <div className="button-list">
            <button type="button" className="add button" onClick={this.showImpactForm}>Add Impact</button>
            <ul>
              {this.state.impacts_attributes.map((impact, i) => {
                return (
                  <li
                    key={impact.id || i}
                    className={`${impact._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button
                      onClick={evt => this.showImpactForm(evt, { edit: true, index: i })}
                    >
                      {impact.name || 'No name'}
                    </button>
                    <button type="button" className="delete button" onClick={() => this.deleteImpact(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
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
      </div>
    );
  }
}

/* PropTypes */
EditStudyCasePage.propTypes = {
  // State
  studyCases: PropTypes.object,
  bmes: PropTypes.array,
  solutionCategories: PropTypes.array,
  // Reselect
  studyCaseDetail: PropTypes.object,
  solutionTree: PropTypes.object
};

/* Map state to props */
const mapStateToProps = state => ({
  studyCases: state.studyCases,
  studyCaseDetail: getStudyCaseDetail(state),
  bmes: state.bmes.list,
  solutionTree: solutionTreeSelector(state),
  solutionCategories: state.categories.solution
});

export default connect(mapStateToProps, null)(EditStudyCasePage);
