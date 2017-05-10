import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases } from 'modules/study-cases';
import PropTypes from 'prop-types';
import { Form, Button, Input, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';

const emptyStudyCase = {
  name: ''
};

class EditStudyCasePage extends React.Component {

  /* Component lifecycle */
  componentWillMount() {
    this.props.studyCaseDetail || dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
  }

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();
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
            <Link className="button alert">Cancel</Link>
          </BtnGroup>
          <Input type="text" name="name" value={name} label="Study case title" validations={['required']} />
          <Textarea name="solution" value={solution} label="Solution" validations={[]} />
          <Textarea name="situation" value={situation} label="situation" validations={[]} />
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
