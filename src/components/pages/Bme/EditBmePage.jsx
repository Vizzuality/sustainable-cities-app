import React from 'react';
import { dispatch } from 'main';
import { getBmes, updateBme } from 'modules/bmes';
import { Input, Button, Form, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import getBmeDetail from 'selectors/bmeDetail';
import { validation } from 'utils/validation';
import { Autobind } from 'es-decorators';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';

class EditBmePage extends React.Component {

  constructor(props) {
    super(props);
    this.form = {};
  }

  /* Lifecycle */
  componentWillMount() {
    if (!this.props.bmesDetail) {
      dispatch(getBmes(this.props.bmes.detailId));
    }
  }

  /* Methods */
  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onSubmit(evt) {
    evt.preventDefault();
    // Update BME
    dispatch(updateBme({
      id: this.props.bmesDetail.id,
      data: this.form,
      onSuccess() {
        toastr.success('Business model element edited!');
      }
    }));
  }

  render() {
    return (
      <section className="c-form">
        <Form onSubmit={this.onSubmit}>
          <BtnGroup>
            <Link to="/business-model-element" className="c-btn -secondary">Cancel</Link>
            <Button type="submit" className="c-btn -primary">Edit</Button>
          </BtnGroup>
          <Input
            type="text"
            name="name"
            placeholder="Business model element title"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.props.bmesDetail ? this.props.bmesDetail.name : ''}
          />
          <Textarea
            name="description"
            placeholder="Description"
            validations={['required']}
            onChange={this.onInputChange}
            value={this.props.bmesDetail ? this.props.bmesDetail.description : ''}
          />
        </Form>
      </section>
    );
  }
}

EditBmePage.propTypes = {
  bmes: React.PropTypes.object,
  // Selector
  bmesDetail: React.PropTypes.object
};

// Map state to props
const mapStateToProps = state => ({
  bmes: state.bmes,
  bmesDetail: getBmeDetail(state)
});

export default connect(mapStateToProps, null)(EditBmePage);
