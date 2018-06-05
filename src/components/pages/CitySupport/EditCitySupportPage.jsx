import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import moment from 'moment';

// modules
import { getCitySupport, getCategories, updateCitySupport, resetCitySupport } from 'modules/city-support';

// components
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import DropZone from 'components/dropzone/DropZone';
import DatePicker from 'react-datepicker';

// constants
import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/city-support';

class EditCitySupportPage extends React.Component {
  constructor(props) {
    super(props);

    const {
      title,
      description,
      date,
      photos_attributes: photosAttributes,
      image_source: imageSource
    } = props.city;

    this.state = {
      title: title || null,
      date: date || moment(),
      description: description || null,
      photos_attributes: photosAttributes || [],
      image_source: imageSource || null
    };
  }

  componentWillMount() {
    dispatch(getCategories());
    if (this.props.detailId) dispatch(getCitySupport({ id: this.props.detailId }));
  }

  componentWillReceiveProps(nextProps) {
    const eventChanged = !isEqual(this.props.city, nextProps.city);
    if (eventChanged) {
      const {
        title,
        description,
        date,
        photos_attributes: photosAttributes,
        city_support_category_id: category,
        image_source: imageSource
      } = nextProps.city;

      this.setState({
        title,
        description,
        date: moment(date),
        city_support_category_id: category,
        photos_attributes: photosAttributes || [],
        image_source: imageSource
      });
    }
  }

  componentWillUnmount() {
    dispatch(resetCitySupport());
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.state[evt.target.name] = evt.target.value;
  }

  onChangeDate = (date) => {
    this.setState({ date });
  }

  onSelectChange = (field, val) => {
    this.setState({
      [field]: val.value
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    dispatch(updateCitySupport({
      id: this.props.detailId,
      data: this.state,
      onSuccess() {
        toastr.success('City support edited succesfully');
      },
      onError: ({ title }) => {
        toastr.error(title);
      }
    }));
  }

  render() {
    const { categories } = this.props;
    const {
      title,
      description,
      city_support_category_id: category,
      date,
      image_source: imageSource
    } = this.state;

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/backoffice/city-supports" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="column small-8">
              {/* Title */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="title"
                value={title || ''}
                label="Title"
                validations={['required']}
              />
            </div>
            <div className="column small-4">
              <Select
                required
                name="city_support_category_id"
                value={category}
                onChange={val => this.onSelectChange('city_support_category_id', val)}
                label="Category"
                options={categories}
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-12">
              {/* Description */}
              <Textarea
                onChange={this.onInputChange}
                name="description"
                value={description || ''}
                label="Description"
                validations={[]}
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-12">
              {/* Date */}
              <label htmlFor="date">Date *</label>
              <DatePicker
                name="date"
                selected={date}
                onChange={this.onChangeDate}
                dateFormat="LL"
                placeholderText="Select a date"
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-12">
              {/* Image source */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="image_source"
                value={imageSource || ''}
                label="Image source"
                validations={[]}
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-6">
              {/* Image */}
              <DropZone
                title="City support image"
                accept={'image/png, image/jpg, image/jpeg'}
                files={DropZone.defaultFileTransform(this, 'photos_attributes')}
                onDrop={DropZone.defaultDropOnEdit(this, 'photos_attributes', MAX_IMAGES_ACCEPTED)}
                onDelete={DropZone.defaultDeleteOnNew(this, 'photos_attributes')}
                withImage
                multiple={false}
                maxSize={MAX_SIZE_IMAGE}
              />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

EditCitySupportPage.propTypes = {
  city: PropTypes.object,
  categories: PropTypes.array,
  detailId: PropTypes.number
};

EditCitySupportPage.defaultProps = {
  city: {},
  categories: []
};

// Map state to props
const mapStateToProps = ({ citySupport }) => ({
  city: citySupport.list[0],
  detailId: citySupport.detailId,
  categories: citySupport.categories.list
});

export default connect(mapStateToProps, null)(EditCitySupportPage);
