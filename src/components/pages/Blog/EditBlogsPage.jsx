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
import { getBlogs, updateBlogs, resetBlogs } from 'modules/blogs';

// components
import { Input, Button, Form } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import DropZone from 'components/dropzone/DropZone';
import DatePicker from 'react-datepicker';

// constants
import { MAX_IMAGES_ACCEPTED, MAX_SIZE_IMAGE } from 'constants/blog';

class EditBlogsPage extends React.Component {
  constructor(props) {
    super(props);

    const {
      title,
      link,
      date,
      photos_attributes: photosAttributes
    } = props.blog;

    this.state = {
      title: title || null,
      date: date || moment(),
      link: link || null,
      photos_attributes: photosAttributes || []
    };
  }

  componentWillMount() {
    if (this.props.detailId) dispatch(getBlogs({ id: this.props.detailId }));
  }

  componentWillReceiveProps(nextProps) {
    const blogChanged = !isEqual(this.props.blog, nextProps.blog);
    if (blogChanged) {
      const {
        title,
        link,
        date,
        photos_attributes: photosAttributes
      } = nextProps.blog;

      this.setState({
        title,
        link,
        date: moment(date),
        photos_attributes: photosAttributes || []
      });
    }
  }

  componentWillUnmount() {
    dispatch(resetBlogs());
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

    dispatch(updateBlogs({
      id: this.props.detailId,
      data: this.state,
      onSuccess() {
        toastr.success('Blog edited succesfully');
      },
      onError: ({ title }) => {
        toastr.error(title);
      }
    }));
  }

  render() {
    const { title, link, date } = this.state;

    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/blogs" className="button alert">Cancel</Link>
            <Button type="submit" className="button success">Edit</Button>
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
                title="Blog image"
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

EditBlogsPage.propTypes = {
  blog: PropTypes.object,
  detailId: PropTypes.number
};

EditBlogsPage.defaultProps = {
  blog: {}
};

// Map state to props
const mapStateToProps = ({ blogs }) => ({
  blog: blogs.list[0],
  detailId: blogs.detailId
});

export default connect(mapStateToProps, null)(EditBlogsPage);
