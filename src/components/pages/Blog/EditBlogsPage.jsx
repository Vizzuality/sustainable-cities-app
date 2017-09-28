import React from 'react';
import PropTypes from 'prop-types';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { Input, Button, Form, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';

// modules
import { getCountries } from 'modules/countries';
import { getCities, updateCity, resetCities } from 'modules/cities';

// components
import DropZone from 'components/dropzone/DropZone';

// constants
import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/cities';

class EditMiscellaneousPage extends React.Component {
  constructor(props) {
    super(props);

    const {
      name, countryId, photos_attributes: photosAttributes,
      province, lat, lng
    } = props.city;

    this.state = {
      name,
      country_id: countryId,
      province,
      lat,
      lng,
      photos_attributes: photosAttributes || []
    };
  }

  componentWillMount() {
    dispatch(getCountries());

    if (this.props.detailId) dispatch(getCities({ id: this.props.detailId }));
  }

  componentWillReceiveProps(nextProps) {
    const cityChanged = !isEqual(this.props.city, nextProps.city);
    if (cityChanged) {
      const {
        name, countryId, photos_attributes: photosAttributes,
        province, lat, lng
      } = nextProps.city;

      this.setState({
        name,
        country_id: countryId,
        province,
        lat,
        lng,
        photos_attributes: photosAttributes
      });
    }
  }

  componentWillUnmount() {
    dispatch(resetCities());
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.state[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val = {}) {
    this.setState({
      [field]: val.value
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    // Update Enabling
    dispatch(updateCity({
      id: this.props.detailId,
      data: this.state,
      onSuccess() {
        toastr.success('City edited succesfully');
      },
      onError: ({ title }) => {
        toastr.error(title);
      }
    }));
  }

  render() {
    const { countries } = this.props;
    const { name, province, lat, lng, country_id: countryId } = this.state;

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/cities" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="column small-6">
              {/* Name */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="name"
                value={name || ''}
                label="Name"
                validations={['required']}
              />
            </div>
            <div className="column small-6">
              {/* Province */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="province"
                value={province || ''}
                label="Province"
                validations={['required']}
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-12">
              {/* Country */}
              <Select
                name="country_id"
                label="Country"
                required
                validations={['required']}
                value={countryId}
                onChange={val => this.onSelectChange('country_id', val)}
                options={countries.map(cat => ({ value: cat.id, label: cat.name }))}
              />
            </div>
          </div>
          <div className="row expanded -flex">
            <div className="column small-3">
              {/* Location - lat */}
              <Input
                type="number"
                min="-90"
                max="90"
                step="0.00000001"
                onChange={this.onInputChange}
                name="lat"
                value={lat || ''}
                label="Latitude"
                validations={['required']}
              />
            </div>
            <div className="column small-3">
              {/* Location - lng */}
              <Input
                type="number"
                min="-180"
                max="180"
                step="0.00000001"
                onChange={this.onInputChange}
                name="lng"
                value={lng || ''}
                label="Longitude"
                validations={['required']}
              />
            </div>
          </div>
          <div className="row expanded">
            <div className="column small-6">
              <DropZone
                title="Images"
                accept={'image/png, image/jpg, image/jpeg'}
                files={DropZone.defaultFileTransform(this, 'photos_attributes')}
                onDrop={DropZone.defaultDropOnEdit(this, 'photos_attributes', MAX_IMAGES_ACCEPTED)}
                onDelete={DropZone.defaultDeleteOnEdit(this, 'photos_attributes')}
                multiple={false}
                withImage
                maxSize={MAX_SIZE_IMAGE}
              />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

EditMiscellaneousPage.propTypes = {
  city: PropTypes.object,
  countries: PropTypes.array,
  detailId: PropTypes.number
};

EditMiscellaneousPage.defaultProps = {
  city: {},
  countries: []
};

// Map state to props
const mapStateToProps = ({ cities, countries }) => ({
  city: cities.list[0],
  countries: countries.list,
  detailId: cities.detailId
});

export default connect(mapStateToProps, null)(EditMiscellaneousPage);
