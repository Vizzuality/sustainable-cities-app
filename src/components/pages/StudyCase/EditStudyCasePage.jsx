import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase, deleteStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { getBmes } from 'modules/bmes';
import PropTypes from 'prop-types';
import { Form, Select, Button, Input, Textarea } from 'components/form/Form';
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

import { MAX_IMAGES_ACCEPTED } from 'constants/study-case';

/* Utils */
function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (cb) cb(event.target.result);
  };
  reader.readAsDataURL(file);
}


class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);

    this.form = {
      project_type: 'StudyCase'
    };

    this.state = {
      category_id: null,
      city: {},
      project_bmes_attributes: [],
      impacts_attributes: [],
      external_sources_attributes: [],
      photos_attributes: []
    };
  }

  componentWillMount() {
    dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
    dispatch(getCategories({ type: 'solution' }));
    dispatch(getBmes({
      pageSize: 9999,
      pageNumber: 1
    }));
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
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
          .map(pBme => ({
            id: pBme.id,
            bme_id: pBme.relationships.bme.data.id,
            description: pBme.description,
            is_featured: pBme.is_featured
          })),
        impacts_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'impacts'),
        external_sources_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'external_sources'),
        photos_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'photos')
      });
    }

    if (this.props.studyCaseDetail !== nextProps.studyCaseDetail) {
      const { name, tagline, operational_year, solution, situation } = nextProps.studyCaseDetail;
      const category_id = `${nextProps.studyCaseDetail.category_id}`; // eslint-disable-line camelcase
      this.setState({
        name,
        tagline,
        category_id,
        solution,
        situation,
        operational_year: operational_year ? new Date(operational_year).getFullYear() : undefined
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

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();

    const {
      city,
      category_id,
      impacts_attributes,
      project_bmes_attributes,
      external_sources_attributes,
      operational_year,
      photos_attributes
    } = this.state;

    if (impacts_attributes) {
      impacts_attributes.forEach(impact => delete impact.relationships);
    }

    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        city_ids: [city.value],
        category_id,
        // eslint-disable-next-line no-underscore-dangle
        impacts_attributes,
        // eslint-disable-next-line no-underscore-dangle
        project_bmes_attributes: project_bmes_attributes.filter(pbme => !pbme.id || pbme.edited || pbme._destroy),
        // eslint-disable-next-line no-underscore-dangle
        external_sources_attributes,
        operational_year: new Date(this.form.operational_year || operational_year, 0, 2),
        photos_attributes
      },
      onSuccess: () => {
        toastr.success('The study case has been edited');
        // updates detail after editing
        dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
      }
    }));
  }

  @Autobind
  showDeleteModal() {
    const confirm = <Confirm text={'This study case will be deleted. Are you sure?'} onAccept={() => this.delete()} />;
    dispatch(toggleModal(true, confirm));
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

  /* Impact methods */
  @Autobind
  showImpactForm(evt, opts = {}) {
    evt.preventDefault();
    const action = opts.edit ? this.onImpactEdit : this.onImpactCreate;
    let values = {};
    const { external_sources_attributes } = this.state;
    values.external_sources_index = [];

    if (opts.edit) {
      values = this.state.impacts_attributes[opts.index];

      if (values.external_sources_index) {
        values.external_sources_index = values.external_sources_index;
      } else {
        values.external_sources_index = values.relationships.external_sources.data.map(source => source.id);
      }
    }

    dispatch(toggleModal(
      true,
      <ImpactForm
        text="Add"
        values={values}
        sources={external_sources_attributes.filter(s => !s._destroy).map((source, i) => ({ index: i, id: source.id, name: source.name }))}
        onSubmit={(...args) => action(...args, opts.index)}
      />
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

  /* External sources methods */
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
  createSource(data) {
    this.setState({
      external_sources_attributes: [...this.state.external_sources_attributes, data]
    });
    dispatch(toggleModal(false));
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
  deleteSource(index) {
    // retrieves sources of the project
    const externalSources = this.props.studyCases.included.filter(sc => sc.type === 'external_sources');
    const { external_sources_attributes, impacts_attributes } = this.state;

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

  /* Project bmes methods */
  @Autobind
  addProjectBme(pbme) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = [
      ...this.state.project_bmes_attributes,
      pbme
    ];
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
  onImageDrop(acceptedImgs, rejectedImgs) {
    const parsedPhotos = [];

    rejectedImgs.forEach(file => toastr.error(`The image "${file.name}" hast not a valid extension`));

    acceptedImgs.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        // there is already a picture in the database
        const exists = !!this.state.photos_attributes[0];
        let photoParams = {
          name: file.name,
          attachment: parsedFile
        };

        if(exists) {
          photoParams = {
            ...photoParams,
            id: this.state.photos_attributes[0].id
          }
        } else {
          photoParams = {
            ...photoParams,
            is_active: true
          };
        }

        /* eslint-enable camelcase */
        let photos_attributes = [photoParams];

        /* eslint-enable camelcase */
        this.setState({ photos_attributes });
      });
    });
  }

  @Autobind
  onDeleteImage() {
    this.setState({
      photos_attributes: [{
        id: this.state.photos_attributes[0].id,
        _destroy: true
      }]
    });
  }

  render() {
    // Study case initial values
    const { name, city, tagline, operational_year, solution, situation, photos_attributes } = this.state || {};

    return (
      <div>
        <Form onSubmit={this.submit}>
          <BtnGroup>
            <Button type="submit" className="button success">Edit</Button>
            <button type="button" className="button alert" onClick={this.showDeleteModal}>Delete</button>
            <Link to="/study-cases" className="button">Cancel</Link>
          </BtnGroup>
          {/* Name */}
          <Input
            type="text"
            name="name"
            value={name}
            label="Study case title"
            validations={['required']}
            onChange={this.onInputChange}
          />
          {/* Tagline */}
          <Input
            type="text"
            value={tagline}
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
                onChange={city => this.setState({ city })}
              />
            </div>
            <div className="column small-6">
              {/* Year */}
              <Input
                type="number"
                value={operational_year}
                name="operational_year"
                onChange={this.onInputChange}
                label="Year"
                validations={['required']}
              />
            </div>
          </div>
          <Select
            name="category_id"
            clearable={false}
            label="Category"
            validations={['required']}
            value={this.state.category_id}
            onChange={item => this.setState({ category_id: item.value })}
            options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
          />
          <Textarea name="solution" value={solution} label="Solution" validations={[]} onChange={this.onInputChange} />
          <Textarea
            name="situation"
            value={situation}
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
          <div>
            <button type="button" className="button" onClick={this.showSourceForm}>Add source</button>
            <ul>
              {this.state.external_sources_attributes.map((source, i) => {
                return (
                  <li
                    key={`${source.name}-${i}`}
                    className={`${source._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                    <button type="button" className="button" onClick={() => this.deleteSource(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Impacts */}
          <div>
            <button type="button" className="button" onClick={this.showImpactForm}>Add Impact</button>
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
                    <button type="button" className="button" onClick={() => this.deleteImpact(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Images */}
          <div className="row expanded">
            <div className="column small-6">
              <DropZone
                title="Images"
                accept={'image/png, image/jpg, image/jpeg'}
                files={this.state.photos_attributes.filter(p => !p._destroy).map(photo => ({
                  id: photo.id,
                  name: photo.name,
                  attachment: photo.attachment.url ?
                    `${config['API_URL']}${photo.attachment.url}` : photo.attachment
                }))}
                onDrop={this.onImageDrop}
                onDelete={this.onDeleteImage}
                withImage
                multiple={false}
              />
            </div>
            {/* <div className="column small-6">
              <DropZone
                title="Files"
                files={this.state.documents_attributes}
                accept={'application/pdf, application/json, application/msword, application/excel'}
                onDrop={this.onFileDrop}
                onDelete={this.onDeleteFile}
              />
            </div> */}
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
  studyCaseDetail: PropTypes.object
};

/* Map state to props */
const mapStateToProps = state => ({
  studyCases: state.studyCases,
  studyCaseDetail: getStudyCaseDetail(state),
  bmes: state.bmes.list,
  solutionCategories: state.categories.solution
});

export default connect(mapStateToProps, null)(EditStudyCasePage);
