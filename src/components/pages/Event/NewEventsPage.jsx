import React from 'react';
import { validation } from 'utils/validation'; // eslint-disable-line no-unused-vars
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import moment from 'moment';

// components
import { Input, Button, Form } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import DropZone from 'components/dropzone/DropZone';
import DatePicker from 'react-datepicker';

// modules
import { createEvents } from 'modules/events';

// constants
import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/event';

class NewEventsPage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      title: null,
      date: moment(),
      link: null,
      photos_attributes: []
    };
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.state[evt.target.name] = evt.target.value;
  }

  onChangeDate = (date) => {
    this.setState({ date });
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();

    dispatch(createEvents({
      data: this.state,
      onSuccess: () => {
        dispatch(push('/backoffice/events'));
        toastr.success('Event created successfully');
      },
      onError: ({ title }) => {
        toastr.error(title);
      }
    }));
  }

  render() {
    const { title, link, date, photos_attributes: photosAttributes } = this.state;

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/backoffice/events" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Save</Button>
          </BtnGroup>
          <div className="row expanded">
            <div className="column small-12">
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
          </div>
          <div className="row expanded">
            <div className="column small-12">
              {/* Link */}
              <Input
                type="text"
                onChange={this.onInputChange}
                name="link"
                value={link || ''}
                label="Link"
                validations={['required', 'url']}
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
            <div className="column small-6">
              {/* Image */}
              <DropZone
                title="Event image"
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

// Map state to props
const mapStateToProps = () => ({});

export default connect(mapStateToProps, null)(NewEventsPage);
