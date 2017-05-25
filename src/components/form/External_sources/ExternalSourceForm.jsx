import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';

import { Form, Input, Select, Textarea } from 'components/form/Form';

import { EXTERNAL_SOURCES_TYPES } from 'constants/external-sources';

class ExternalSourceForm extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      type: null
    };

    this.form = {
      name: '',
      description: '',
      pub_year: new Date().getFullYear(),
      author: '',
      organization: '',
      web_url: ''
    };
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    const data = {
      type: this.state.type,
      ...this.form
    };

    this.props.onSubmit(data);
  }

  @Autobind
  onChangeType(name, value) {
    this.state[name] = value;

    this.setState(this.state);
  }

  @Autobind
  onChangeInput(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  render() {
    return (
      <div className="c-external-source-form">
        <Form onSubmit={this.onSubmit}>
          <div className="row expanded">
            <div className="small-12 column">
              {/* name */}
              <Input
                label="Source name"
                name="name"
                onChange={this.onChangeInput}
                value={this.form.name}
                type="text"
                validations={['required']}
              />
            </div>
            <div className="small-12 column">
              {/* type */}
              <Select
                label="Type"
                name="type"
                onChange={e => this.onChangeType('type', e.value)}
                options={EXTERNAL_SOURCES_TYPES}
                validations={['required']}
                value={this.state.type}
              />
            </div>
            <div className="small-12 column">
              {/* description */}
              <Textarea
                label="Description"
                onChange={this.onChangeInput}
                name="description"
                validations={[]}
                value={this.form.description}
              />
            </div>
            <div className="small-6 column">
              {/* publication year */}
              <Input
                label="Publication Year"
                name="pub_year"
                onChange={this.onChangeInput}
                type="number"
                validations={[]}
                value={this.form.pub_year}
              />
            </div>
            <div className="small-6 column">
              {/* organization/journal */}
              <Input
                label="Organization/Journal"
                name="organization"
                onChange={this.onChangeInput}
                type="text"
                validations={[]}
                value={this.form.organization}
              />
            </div>
            <div className="small-6 column">
              {/* author */}
              <Input
                label="Author"
                name="author"
                onChange={this.onChangeInput}
                type="text"
                validations={[]}
                value={this.form.author}
              />
            </div>
            <div className="small-6 column">
              {/* URL */}
              <Input
                label="Web URL"
                name="web_url"
                onChange={this.onChangeInput}
                type="text"
                validations={[]}
                value={this.form.web_url}
              />
            </div>
            <div className="small-12 column">
              <button className="button">Add</button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

ExternalSourceForm.propTypes = {
  onSubmit: PropTypes.func
};

const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(ExternalSourceForm);
