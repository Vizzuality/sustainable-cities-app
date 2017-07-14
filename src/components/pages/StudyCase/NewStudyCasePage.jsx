import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { Select, Input, Form, Button, Textarea } from 'components/form/Form';
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

import debounce from 'lodash/debounce';

/* Utils */
function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    if (cb) cb(event.target.result);
  };
  reader.readAsDataURL(file);
}

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
      external_sources_attributes: []
    };

    this.form = {
      project_type: 'StudyCase'
    };

    this.editProjectBme = debounce(this.editProjectBme, 300);
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getCategories({ type: 'solution' }));
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
      city,
      photos_attributes,
      documents_attributes,
      category_id,
      impacts_attributes,
      external_sources_attributes
    } = this.state;

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
        category_id,
        photos_attributes,
        documents_attributes,
        impacts_attributes,
        project_bmes_attributes: this.state.bmes.map(bme => ({ bme_id: bme.id,
          description: bme.description })),
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
  onImageDrop(acceptedImgs,
    rejectedImgs) {
    const parsedPhotos = [];

    rejectedImgs.forEach(file => toastr.error(`The image "${file.name}" hast not a valid extension`));

    acceptedImgs.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        parsedPhotos.push({
          name: file.name,
          is_active: true,
          attachment: parsedFile
        });

        if (i === (acceptedImgs.length - 1)) {
          /* eslint-disable camelcase */
          let photos_attributes = this.state.photos_attributes.slice();
          photos_attributes = [...photos_attributes, ...parsedPhotos];
          /* eslint-enable camelcase */
          this.setState({ photos_attributes });
        }
      });
    });
  }

  @Autobind
  onFileDrop(acceptedFiles, rejectedFiles) {
    const parsedFiles = [];

    rejectedFiles.forEach(file => toastr.error(`The file "${file.name}" has not a valid extension`));

    acceptedFiles.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        parsedFiles.push({
          name: file.name,
          is_active: true,
          attachment: parsedFile
        });

        if (i === (acceptedFiles.length - 1)) {
          /* eslint-disable camelcase */
          let documents_attributes = this.state.documents_attributes.slice();
          documents_attributes = [...documents_attributes, ...parsedFiles];
          /* eslint-enable camelcase */
          this.setState({ documents_attributes });
        }
      });
    });
  }

  @Autobind
  onDeleteImage(index) {
    // eslint-disable-next-line camelcase
    const photos_attributes = this.state.photos_attributes.slice();
    window.URL.revokeObjectURL(photos_attributes[index].attachment);
    photos_attributes.splice(index, 1);
    this.setState({ photos_attributes });
  }

  @Autobind
  onDeleteFile(index) {
    // eslint-disable-next-line camelcase
    const documents_attributes = this.state.documents_attributes.slice();
    window.URL.revokeObjectURL(documents_attributes[index].attachment);
    documents_attributes.splice(index, 1);
    this.setState({ documents_attributes });
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
  addProjectBme(bme) {
    const bmes = [
      ...this.state.bmes,
      bme
    ];
    this.setState({ bmes });
  }

  editProjectBme(data, index) {
    const bmes = this.state.bmes.slice();
    bmes[index] = {
      ...bmes[index],
      ...data
    };
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
        <Select
          name="category_id"
          clearable={false}
          label="Category"
          validations={['required']}
          value={this.state.category_id}
          onChange={item => this.setState({ category_id: item.value })}
          options={this.props.categories.solution.map(cat => ({ value: cat.id, label: cat.name }))}
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
          options={this.props.bmes.map(bme => ({ label: bme.name, value: bme.id }))}
          items={this.state.bmes}
          onAdd={this.addProjectBme}
          onEdit={(...args) => this.editProjectBme(...args)}
          onDelete={this.deleteProjectBme}
        />
        {/* Sources */}
        <div>
          <button type="button" className="button" onClick={this.showSourceForm}>Add Source</button>
          {this.state.external_sources_attributes.map((source, i) => {
            return (
              <li key={source.name}>
                <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                <button className="button" onClick={() => this.deleteSource(i)}>Delete</button>
              </li>
            );
          })}
        </div>
        {/* Impacts */}
        <div>
          <button type="button" className="button" onClick={this.showImpactForm}>Add Impact</button>
          <ul>
            {this.state.impacts_attributes.map((impact, i) => {
              return (
                <li key={impact.name}>
                  <button onClick={evt => this.showImpactForm(evt, { edit: true, index: i })}>{impact.name}</button>
                  <button className="button" onClick={() => this.deleteImpact(i)}>Delete</button>
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
              onDrop={this.onImageDrop}
              onDelete={this.onDeleteImage}
              withImage
            />
          </div>
          <div className="column small-6">
            <DropZone
              title="Files"
              files={this.state.documents_attributes}
              accept={'application/pdf, application/json, application/msword, application/excel'}
              onDrop={this.onFileDrop}
              onDelete={this.onDeleteFile}
            />
          </div>
        </div>
      </Form>
    );
  }
}

// Map state to props
const mapStateToProps = ({ categories, bmes }) => ({
  categories: {
    solution: categories.solution
  },
  bmes: bmes.list
});

NewStudyCasePage.defaultProps = {
  bmes: []
};

NewStudyCasePage.propTypes = {
  categories: PropTypes.array,
  bmes: PropTypes.array
};

export default connect(mapStateToProps, null)(NewStudyCasePage);
