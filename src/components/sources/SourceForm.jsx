import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button, Textarea } from 'components/form/Form';

export default class SourceForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    values: PropTypes.object,
    text: PropTypes.string
  };

  static defaultProps = {
    values: {},
    tect: "Add"
  };

  state = {
    form: {}
  }

  onInputChange = (evt) => {
    this.setState({
      form: {
        ...this.state.form,
        [evt.target.name]: evt.target.value,
      }
    })
  }

  submit = (evt) => {
    evt.preventDefault();

    this.props.onSubmit(this.state.form);
  }

  render() {
    const {
      text,
      values: {
        name,
        sourceType,
        description,
        publicationYear,
        institution,
        author,
        webUrl
      },
    } = this.props;

    return (
      <div className="c-source-form">
        <Form onSubmit={this.submit}>
          <span>Sources</span>
          <div className="row expanded">
            <div className="column small-6">
              <Input
                id="name"
                label="Name"
                value={name}
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
                value={sourceType}
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
                value={publicationYear}
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
                value={institution}
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
                value={author}
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
                value={webUrl}
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
