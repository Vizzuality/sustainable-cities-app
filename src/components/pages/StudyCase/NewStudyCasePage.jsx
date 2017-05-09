import React from 'react';
import { Input, Form, Button, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { validation } from 'utils/validation';
import { createStudyCase } from 'modules/study-cases';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import { push } from 'react-router-redux';
import Creator from 'components/creator/Creator';
import DropZone from 'components/dropzone/DropZone';

function toBase64(file, cb) {
  const reader = new FileReader();
  reader.onload = (event) => {
    cb && cb(event.target.result);
  };
  reader.readAsDataURL(file);
}

export default class NewStudyCasePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      photos: []
    };
    this.form = {};
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    dispatch(createStudyCase({
      data: {
        ...this.form,
        photos: this.state.photos
      },
      onSuccess() {
        dispatch(push('/study-cases'));
        toastr.success('Study case created!');
      }
    }));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onBmeAdd(comment) {
    const comments = this.state.comments.slice();
    comments.push(comment);
    this.setState({ comments });
  }

  @Autobind
  onImageDrop(acceptedImg, rejectedFiles) {
    const parsedPhotos = [];

    rejectedFiles.forEach(file => toastr.error(`The file "${file.name}" is not a valid image`));

    acceptedImg.forEach((file, i) => {
      toBase64(file, (parsedFile) => {
        parsedPhotos.push({
          name: file.name,
          is_active: true,
          attachment: parsedFile
        });

        if (i === (acceptedImg.length - 1)) {
          let photos = this.state.photos.slice();
          photos = [...photos, ...parsedPhotos];
          this.setState({ photos });
        }
      });
    });
  }

  @Autobind
  onDelete(index) {
    const photos = this.state.photos.slice();
    photos.splice(index, 1);
    this.setState({ photos });
  }

  render() {
    return (
      <Form onSubmit={this.onSubmit}>
        {/* Submit buttons */}
        <BtnGroup>
          <Button className="button success" type="submit">Save</Button>
          <Link className="button alert" to="/study-cases">Cancel</Link>
        </BtnGroup>
        {/* Name */}
        <Input type="text" value="" name="name" onChange={this.onInputChange} label="Study case title" validations={['required']} />
        <Textarea validations={[]} onChange={this.onInputChange} label="Solution" name="solution" />
        <Textarea validations={[]} onChange={this.onInputChange} label="Situation" name="situation" />
        <Creator title="BMEs" items={this.state.comments} onAdd={this.onBmeAdd} />
        <div className="row expanded">
          <div className="column small-6">
            <DropZone title="Images" accept={'image/png, image/jpg, image/jpeg'} images={this.state.photos} onDrop={this.onImageDrop} onDelete={this.onDelete} />
          </div>
          <div className="column small-6">
            <DropZone title="Files" />
          </div>
        </div>
      </Form>
    );
  }
}
