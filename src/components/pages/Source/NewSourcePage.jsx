import React from 'react';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { dispatch } from 'main';
import { createSource } from 'modules/sources';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';

import { SOURCE_TYPE_OPTIONS } from 'constants/sources';

class NewSourcePage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      type: {}
    };
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form
    };

    // Create source
    dispatch(createSource({
      data,
      onSuccess() {
        // Redirect to bme list
        dispatch(push('/source'));
        toastr.success('Source created!');
      }
    }));
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: Array.isArray(val) ?
        val.map(v => v.value) : val.value
    });
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/source" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          {/* name */}
          <div className="row expanded">
            <div className="column small-12">
              <Input type="text" onChange={this.onInputChange} name="name" value="" label="Source name" validations={['required']} />
            </div>
          </div>
          <div className="row expanded">
            {/* type */}
            <div className="column small-12">
              <Select
                name="type"
                value={this.state.type}
                onChange={val => this.onSelectChange('type', val)}
                label="Type"
                options={SOURCE_TYPE_OPTIONS}
              />
            </div>
          </div>
          <div className="row expanded">
            {/* description */}
            <div className="column small-12">
              <Textarea
                validations={[]}
                onChange={this.onInputChange}
                name="description"
                value=""
                label="Description"
              />
            </div>
          </div>
          <div className="row expanded">
            {/* organization/journal */}
            <div className="column small-6">
              <Input type="text" onChange={this.onInputChange} name="organization" value="" label="Organization/Journal" validations={[]} />
            </div>
            <div className="column small-6">
              {/* author */}
              <Input type="text" onChange={this.onInputChange} name="author" value="" label="Author" validations={[]} />
            </div>
          </div>
          <div className="row expanded">
            {/* publication year */}
            <div className="column small-6">
              <Input type="number" onChange={this.onInputChange} name="pub_year" value="" label="Publication year" validations={[]} />
            </div>
            {/* web url */}
            <div className="column small-6">
              <Input type="text" onChange={this.onInputChange} name="url" value="" label="Web url" validations={[]} />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

NewSourcePage.propTypes = {};

// Map state to props
const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(NewSourcePage);
