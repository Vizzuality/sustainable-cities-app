import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';

// components
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import DropZone from 'components/dropzone/DropZone';
import DatePicker from 'react-datepicker';

// modules
import { createCitySupport, getCategories } from 'modules/city-support';

// constants
import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/city-support';

class NewCitySupportPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: null,
      date: moment(),
      description: null,
      image_source: null,
      city_support_category_id: null,
      photos_attributes: []
    };
  }

  componentWillMount() {
    dispatch(getCategories());
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

    dispatch(createCitySupport({
      data: this.state,
      onSuccess: () => {
        dispatch(push('/city-supports'));
        toastr.success('City support created successfully');
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
      photos_attributes: photosAttributes,
      image_source: imageSource
     } = this.state;

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/backoffice/city-supports" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
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
                files={photosAttributes}
                onDrop={DropZone.defaultDropOnNew(this, 'photos_attributes', MAX_IMAGES_ACCEPTED)}
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

NewCitySupportPage.propTypes = {
  categories: PropTypes.array
};

NewCitySupportPage.defaultProps = {
  categories: []
};

// Map state to props
const mapStateToProps = ({ citySupport }) => ({
  categories: citySupport.categories.list
});

export default connect(mapStateToProps, null)(NewCitySupportPage);
