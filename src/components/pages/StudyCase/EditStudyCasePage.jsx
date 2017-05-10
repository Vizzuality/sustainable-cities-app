import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase } from 'modules/study-cases';
import PropTypes from 'prop-types';
import { Form, Button, Input, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import CitySearch from 'components/cities/CitySearch';

class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);
    this.form = {
      is_active: true
    };
  }

  /* Component lifecycle */
  componentWillMount() {
    this.props.studyCaseDetail || dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();
    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: this.form,
      onSuccess() {
        toastr.success('The study case has been edited');
      }
    }));
  }

  /* Render */
  render() {
    // Study case initial values
    const { studyCaseDetail } = this.props;
    const name = studyCaseDetail ? studyCaseDetail.name : '';
    const solution = studyCaseDetail ? studyCaseDetail.solution : '';
    const situation = studyCaseDetail ? studyCaseDetail.situation : '';

    console.log(studyCaseDetail);

    return (
      <div>
        <Form onSubmit={this.submit}>
          <BtnGroup>
            <Button type="submit" className="button success">Edit</Button>
            <Link to="/study-cases" className="button alert">Cancel</Link>
          </BtnGroup>
          <Input type="text" name="name" value={name} label="Study case title" validations={['required']} onChange={this.onInputChange} />
          <CitySearch
            multi
            name="city_ids"
            label="Cities"
          />
          <Textarea name="solution" value={solution} label="Solution" validations={[]} onChange={this.onInputChange} />
          <Textarea name="situation" value={situation} label="situation" validations={[]} onChange={this.onInputChange} />
        </Form>
      </div>
    );
  }
}

/* PropTypes */
EditStudyCasePage.propTypes = {
  // State
  studyCases: PropTypes.object,
  // Reselect
  studyCaseDetail: PropTypes.object
};

/* Map state to props */
const mapStateToProps = state => ({
  studyCases: state.studyCases,
  studyCaseDetail: getStudyCaseDetail(state)
});

export default connect(mapStateToProps, null)(EditStudyCasePage);
