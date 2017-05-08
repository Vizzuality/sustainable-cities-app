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
      data: this.form,
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
  onImageDrop(acceptedImg) {
    let photos = this.state.photos.slice();
    photos = [...photos, ...acceptedImg];
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
        <DropZone title="images" images={this.state.photos} onDrop={this.onImageDrop} />
      </Form>
    );
  }
}
