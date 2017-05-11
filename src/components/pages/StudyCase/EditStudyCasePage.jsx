import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase, deleteStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import PropTypes from 'prop-types';
import { Form, Button, Input, Select, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import CitySearch from 'components/cities/CitySearch';

import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import { push } from 'react-router-redux';

import DropZone from 'components/dropzone/DropZone';

function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    cb && cb(event.target.result);
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
      cities: [],
      documents_attributes: [],
      photos_attributes: []
    };
  }

  componentWillMount() {
    dispatch(getCategories({ type: 'solution', pageSize: 9999, sort: 'name' }))
    dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    // Includes arrived! So, we can populate sub-entities
    if ((!this.props.studyCases.included || !this.props.studyCases.included.length) && (nextProps.studyCases.included && nextProps.studyCases.included.length)) {

      this.setState({
        category_id: nextProps.studyCaseDetail.category_id.toString(),
        cities: nextProps.studyCases.included.filter(sc => sc.type === 'cities').map(c => ({ label: c.name, value: c.id })),
        documents_attributes: this.setFiles(nextProps.studyCaseDetail, 'documents'),
        photos_attributes: this.setFiles(nextProps.studyCaseDetail, 'photos')
      });
    }
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onImageDrop(acceptedImgs, rejectedImgs) {
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
          let photos_attributes = this.state.photos_attributes.slice();
          photos_attributes = [...photos_attributes, ...parsedPhotos];

          console.log(photos_attributes);
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
          let documents_attributes = this.state.documents_attributes.slice();
          documents_attributes = [...documents_attributes, ...parsedFiles];
          this.setState({ documents_attributes });
        }
      });
    });
  }

  @Autobind
  onDeleteImage(index) {
    const photos_attributes = this.state.photos_attributes.slice();
    const { id } = this.state.photos_attributes[index];
    window.URL.revokeObjectURL(photos_attributes[index].attachment);
    photos_attributes.splice(index, 1);
    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        photos_attributes: { id: +id, destroy: true }
      }
    }));
    this.setState({ photos_attributes });
  }

  @Autobind
  onDeleteFile(index) {
    const documents_attributes = this.state.documents_attributes.slice();
    window.URL.revokeObjectURL(documents_attributes[index].attachment);
    documents_attributes.splice(index, 1);
    this.setState({ documents_attributes });
  }

  setFiles(studyCaseDetail, type) {
    const filesMetadata = [];

    const filesIds = studyCaseDetail.relationships[type].data.length ?
      studyCaseDetail.relationships[type].data.map(f => f.id) : [];

    // obtains raw metadata
    filesIds.forEach((fid) => {
      const file = studyCaseDetail.included.find(inc => inc.type === type && inc.id === fid);
      file && filesMetadata.push(file);
    });

    // parses metadata
    filesMetadata.forEach((fm, i) => {
      filesMetadata[i] = {
        attachment: `${config.API_URL}${fm.attachment.thumbnail.url}`,
        is_active: fm.is_active,
        name: fm.name,
        id: fm.id
      };
    });

    return filesMetadata;
  }

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();

    const { category_id, cities, documents_attributes, photos_attributes } = this.state;

    console.log('submit')
    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        category_id,
        city_ids: cities.map(c => c.value),
        documents_attributes,
        photos_attributes
      },
      onSuccess() {
        toastr.success('The study case has been edited');
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

  /* Render */
  render() {
    // Study case initial values
    const { studyCaseDetail } = this.props;
    const name = studyCaseDetail ? studyCaseDetail.name : '';
    const solution = studyCaseDetail ? studyCaseDetail.solution : '';
    const situation = studyCaseDetail ? studyCaseDetail.situation : '';

    return (
      <div>
        <Form onSubmit={this.submit}>
          <BtnGroup>
            <Button type="submit" className="button success">Edit</Button>
            <button type="button" className="button alert" onClick={this.showDeleteModal}>Delete</button>
            <Link to="/study-cases" className="button">Cancel</Link>
          </BtnGroup>
          <Input type="text" name="name" value={name} label="Study case title" validations={['required']} onChange={this.onInputChange} />
          <div className="row expanded">
            <div className="small-12 columns">
              <Select
                name="category_id"
                label="Category"
                validations={['required']}
                value={this.state.category_id}
                onChange={item => this.setState({ category_id: item.value })}
                options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
          </div>
          <CitySearch
            multi
            name="city_ids"
            label="Cities"
            value={this.state.cities}
            onChange={items => this.setState({ cities: items })}
          />
          <Textarea name="solution" value={solution} label="Solution" validations={[]} onChange={this.onInputChange} />
          <Textarea name="situation" value={situation} label="situation" validations={[]} onChange={this.onInputChange} />
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
      </div>
    );
  }
}

/* PropTypes */
EditStudyCasePage.propTypes = {
  // State
  solutionCategories: PropTypes.array,
  studyCases: PropTypes.object,
  // Reselect
  studyCaseDetail: PropTypes.object
};

/* Map state to props */
const mapStateToProps = state => ({
  solutionCategories: state.categories.solution,
  studyCases: state.studyCases,
  studyCaseDetail: getStudyCaseDetail(state)
});

export default connect(mapStateToProps, null)(EditStudyCasePage);
