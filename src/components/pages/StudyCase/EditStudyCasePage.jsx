import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase, deleteStudyCase } from 'modules/study-cases';
import PropTypes from 'prop-types';
import { Form, Button, Input, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import CitySearch from 'components/cities/CitySearch';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import { push } from 'react-router-redux';

class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);

    this.form = {
      project_type: 'StudyCase'
    };

    this.state = {
      cities: [],
      bmes: []
    };
  }

  componentWillMount() {
    dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    // Includes arrived! So, we can populate sub-entities
    if ((!this.props.studyCases.included || !this.props.studyCases.included.length) && (nextProps.studyCases.included && nextProps.studyCases.included.length)) {
      this.setState({
        cities: nextProps.studyCases.included.filter(sc => sc.type === 'cities').map(c => ({ label: c.name, value: c.id }))
      });
    }
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();

    const { cities } = this.state;

    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        city_ids: cities.map(c => c.value)
      },
      onSuccess() {
        toastr.success('The study case has been edited');
      }
    }));
  }

  @Autobind
  showDeleteModal() {
    const confirm = <Confirm text={'This study case will be deleted. Are you sure?'} onAccept={() => this.delete()} />;
    dispatch(toggleModal(true, confirm));
  }

  delete() {
    const { id } = this.props.studyCaseDetail;
    dispatch(deleteStudyCase({
      id,
      onSuccess() {
        toastr.success('The study case has been deleted');
        dispatch(push('/study-cases'));
      }
    }));
  }

  /* Render */
  render() {
    // Study case initial values
    const { studyCaseDetail, studyCases } = this.props;
    const name = studyCaseDetail ? studyCaseDetail.name : '';
    const solution = studyCaseDetail ? studyCaseDetail.solution : '';
    const situation = studyCaseDetail ? studyCaseDetail.situation : '';

    return (
      <div>
        <Form onSubmit={this.submit}>
          <BtnGroup>
            <Button type="submit" className="button success">Edit</Button>
            <button type="button" className="button alert" onClick={this.showDeleteModal}>Delete</button>
            <Link to="/study-cases" className="button">Cancel</Link>
          </BtnGroup>
          <Input type="text" name="name" value={name} label="Study case title" validations={['required']} onChange={this.onInputChange} />
          <CitySearch
            multi
            name="city_ids"
            label="Cities"
            value={this.state.cities}
            onChange={items => this.setState({ cities: items })}
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
