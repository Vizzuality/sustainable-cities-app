import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Textarea } from 'components/form/Form';
import { Autobind } from 'es-decorators';

export default class SourceForm extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  submit(evt) {
    evt.preventDefault();
    if (this.props.onSubmit) {
      this.props.onSubmit(this.form);
    }
  }

  render() {
    const { values, text } = this.props;
    const {
      name,
      source_type,
      description,
      publication_year,
      institution,
      author,
      web_url
    } = values;

    return (
      <div className="c-source-form">
        <Form onSubmit={this.submit}>
          <span>Sources</span>
          <div className="row expanded">
            <div className="column small-6">
              <Input
                id="name"
                label="Name"
                value={name || ''}
                type="text"
                name="name"
                validations={['required']}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                id="type"
                label="Type"
                value={source_type || ''} // eslint-disable-line camelcase
                type="text"
                name="source_type"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-12">
              <Textarea
                id="description"
                label="Description"
                value={description || ''}
                name="description"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                id="publication_year"
                label="Publication year"
                value={publication_year || ''} // eslint-disable-line camelcase
                type="text"
                name="publication_year"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                id="institution"
                label="Institution"
                value={institution || ''}
                type="text"
                name="institution"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                id="author"
                label="Author"
                value={author || ''}
                type="text"
                name="author"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
            <div className="column small-6">
              <Input
                id="web_url"
                label="Web url"
                value={web_url || ''} // eslint-disable-line camelcase
                type="text"
                name="web_url"
                validations={[]}
                onChange={this.onInputChange}
              />
            </div>
          </div>
          <Button className="button">{text}</Button>
        </Form>
      </div>
    );
  }
}

/* Prop types */
SourceForm.propTypes = {
  onSubmit: PropTypes.func,
  values: PropTypes.object,
  text: PropTypes.string
};

/* Default props */
SourceForm.defaultProps = {
  values: {}
};
