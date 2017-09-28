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
import { push } from 'react-router-redux';

// modules
import { getCountries } from 'modules/countries';
import { createCity } from 'modules/cities';

class NewCityPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: null,
      country_id: null,
      province: null,
      lat: null,
      lng: null
    };
  }

  /* Lifecycle */
  componentWillMount() {
    dispatch(getCountries());
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

    dispatch(createCity({
      data: this.state,
      onSuccess: () => {
        dispatch(push('/cities'));
        toastr.success('City created successfully');
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
            <Button type="submit" className="button success">Save</Button>
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
        </Form>
      </section>
    );
  }
}

NewCityPage.propTypes = {
  countries: PropTypes.array
};

NewCityPage.defaultProps = {
  countries: []
};

// Map state to props
const mapStateToProps = ({ countries }) => ({
  countries: countries.list
});

export default connect(mapStateToProps, null)(NewCityPage);
