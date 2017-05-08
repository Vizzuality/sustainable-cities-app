import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { Link } from 'react-router';
import { getSources, updateSource } from 'modules/sources';
import { Input, Button, Form, Textarea, Select } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getSourceDetail from 'selectors/sourceDetail';
import { Autobind } from 'es-decorators';
import isEqual from 'lodash/isEqual';

import { SOURCE_TYPE_OPTIONS } from 'constants/sources';

class EditSourcePage extends React.Component {

  constructor(props) {
    super(props);

    this.form = {};
    this.state = {
      type: {}
    };
  }

  /* Lifecycle */
  componentWillMount() {
    if (!this.props.sourceDetail) {
      dispatch(getSources({ id: this.props.sources.detailId }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.sourceDetail, nextProps.sourceDetail)) {
      this.setState({
        type: nextProps.sourceDetail.type
      });
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  onSelectChange(field, val) {
    this.setState({
      [field]: val.map(v => v.value)
    });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    const data = {
      ...this.form
    };

    // Update source
    dispatch(updateSource({
      id: this.props.sourceDetail.id,
      data,
      onSuccess() {
        toastr.success('Source edited!');
      }
    }));
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
          </BtnGroup>
          {/* name */}
          <div className="row expanded">
            <div className="column small-12">
              <Input type="text" onChange={this.onInputChange} name="name" value={this.props.sourceDetail ? this.props.sourceDetail.name : ''} label="Source name" validations={['required']} />
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
                value={this.props.sourceDetail ? this.props.sourceDetail.description : ''}
                label="Description"
              />
            </div>
          </div>
          <div className="row expanded">
            {/* organization/journal */}
            <div className="column small-6">
              <Input type="text" onChange={this.onInputChange} name="organization" value={this.props.sourceDetail ? this.props.sourceDetail.organization : ''} label="Organization/Journal" validations={[]} />
            </div>
            <div className="column small-6">
              {/* author */}
              <Input type="text" onChange={this.onInputChange} name="author" value={this.props.sourceDetail ? this.props.sourceDetail.author : ''} label="Author" validations={[]} />
            </div>
          </div>
          <div className="row expanded">
            {/* publication year */}
            <div className="column small-6">
              <Input type="number" onChange={this.onInputChange} name="pub_year" value={this.props.sourceDetail ? this.props.sourceDetail.pub_year : ''} label="Publication year" validations={[]} />
            </div>
            {/* web url */}
            <div className="column small-6">
              <Input type="text" onChange={this.onInputChange} name="url" value={this.props.sourceDetail ? this.props.sourceDetail.url : ''} label="Web url" validations={[]} />
            </div>
          </div>
        </Form>
      </section>
    );
  }
}

EditSourcePage.propTypes = {
  sources: PropTypes.object,
  sourceDetail: PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  sources: state.sources,
  sourceDetail: getSourceDetail(state)
});

export default connect(mapStateToProps, null)(EditSourcePage);
