import React from 'react';
import { connect } from 'react-redux';
import getStudyCaseDetail from 'selectors/studyCaseDetail';
import { dispatch } from 'main';
import { getStudyCases, updateStudyCase, deleteStudyCase } from 'modules/study-cases';
import { getCategories } from 'modules/categories';
import { getBmes } from 'modules/bmes';
import PropTypes from 'prop-types';
import { Form, Select, Button, Input, Textarea } from 'components/form/Form';
import BtnGroup from 'components/ui/BtnGroup';
import { Link } from 'react-router';
import { Autobind } from 'es-decorators';
import { toastr } from 'react-redux-toastr';
import CitySearch from 'components/cities/CitySearch';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import { push } from 'react-router-redux';
import Creator from 'components/creator/Creator';
import ImpactForm from 'components/impacts/ImpactForm';

class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);

    this.form = {
      project_type: 'StudyCase'
    };

    this.state = {
      category_id: null,
      cities: [],
      bmes: [],
      impacts_attributes: []
    };
  }

  componentWillMount() {
    dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
    dispatch(getCategories({ type: 'solution' }));
    dispatch(getBmes({
      pageSize: 9999,
      pageNumber: 1
    }));
  }

  /* Component lifecycle */
  componentWillReceiveProps(nextProps) {
    // Includes arrived! So, we can populate sub-entities
    if ((!this.props.studyCases.included || !this.props.studyCases.included.length) && (nextProps.studyCases.included && nextProps.studyCases.included.length)) {
      const bmes = nextProps.studyCases.included.filter(sc => sc.type === 'project_bmes').map(bme => ({ id: bme.relationships.bme.data.id, description: bme.description }));
      this.setState({
        cities: nextProps.studyCases.included.filter(sc => sc.type === 'cities').map(city => ({ label: city.name, value: city.id })),
        bmes,
        impacts_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'impacts'),
        originalBmes: bmes
      });
    }

    if (this.props.studyCaseDetail !== nextProps.studyCaseDetail) {
      const category_id = nextProps.studyCaseDetail.category_id + '';
      this.setState({ category_id });
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

    const { cities, category_id, impacts_attributes, bmes, originalBmes } = this.state;
    const project_bmes_attributes = bmes.filter(bme => !originalBmes.some(i => i.id === bme.id));

    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        city_ids: cities.map(c => c.value),
        category_id,
        project_bmes_attributes,
        impacts_attributes: impacts_attributes.filter(i => !i.id || i._destroy || i.edited)
      },
      onSuccess: () => {
        toastr.success('The study case has been edited');
        dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
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

  /* Impact methods */
  @Autobind
  showImpactForm(evt, opts) {
    evt.preventDefault();
    let values = {};
    let action = this.onImpactCreate;

    if (opts.edit) {
      values = this.state.impacts_attributes[opts.index];
      action = this.onImpactEdit;
    }

    dispatch(toggleModal(true, <ImpactForm text="Add" values={values} onSubmit={(...args) => action(...args, opts.index)} />));
  }

  @Autobind
  onImpactCreate(form) {
    this.setState({
      impacts_attributes: [...this.state.impacts_attributes, form]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  deleteImpact(index) {
    const impacts = this.props.studyCases.included.filter(sc => sc.type === 'impacts');
    const impactToDelete = this.state.impacts_attributes[index];

    const exists = impacts.find(i => i.id === impactToDelete.id);
    const { impacts_attributes } = this.state;

    if (!exists) {
      // Impact still doesn't exist on database,
      // just remove it from local array
      impacts_attributes.splice(index, 1);
    } else {
      // Impact exists on database,
      // we have to delete it from there
      impacts_attributes[index] = {
        id: impactToDelete.id,
        _destroy: true
      };
    }

    this.setState({ impacts_attributes });
  }

  @Autobind
  onImpactEdit(data, index) {
    const impacts_attributes = this.state.impacts_attributes.slice();
    impacts_attributes[index] = {
      ...impacts_attributes[index],
      ...data,
      edited: true
    };
    this.setState({ impacts_attributes });
    dispatch(toggleModal(false));
  }

  @Autobind
  addBme(bme) {
    const bmes = [
      ...this.state.bmes,
      bme
    ];
    this.setState({ bmes });
  }

  @Autobind
  editBme(data, index) {
    const bmes = this.state.bmes.slice();
    bmes[index] = {
      ...bmes[index],
      ...data
    };
    this.setState({ bmes });
  }

  /* Render */
  render() {
    // Study case initial values
    const { studyCaseDetail } = this.props;
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
          <Select
            name="category_id"
            clearable={false}
            label="Category"
            validations={['required']}
            value={this.state.category_id}
            onChange={item => this.setState({ category_id: item.value })}
            options={this.props.solutionCategories.map(cat => ({ value: cat.id, label: cat.name }))}
          />
          <Textarea name="solution" value={solution} label="Solution" validations={[]} onChange={this.onInputChange} />
          <Textarea name="situation" value={situation} label="situation" validations={[]} onChange={this.onInputChange} />
          <Creator
            title="BMEs"
            onAdd={this.addBme}
            onEdit={this.editBme}
            options={this.props.bmes.map(bme => ({ label: bme.name, value: bme.id }))}
            items={this.state.bmes}
          />
          {/* Impacts */}
          <div>
            <button type="button" className="button" onClick={this.showImpactForm}>Add Impact</button>
            <ul>
              {this.state.impacts_attributes.map((impact, i) => {
                return (
                  <li key={i} className={`${impact._destroy ? 'hidden' : ''}`}>
                    <span onClick={evt => this.showImpactForm(evt, { edit: true, index: i })}>{impact.name}</span>
                    <button type="button" className="button" onClick={() => this.deleteImpact(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
        </Form>
      </div>
    );
  }
}

/* PropTypes */
EditStudyCasePage.propTypes = {
  // State
  studyCases: PropTypes.object,
  bmes: PropTypes.array,
  solutionCategories: PropTypes.array,
  // Reselect
  studyCaseDetail: PropTypes.object
};

/* Map state to props */
const mapStateToProps = state => ({
  studyCases: state.studyCases,
  studyCaseDetail: getStudyCaseDetail(state),
  bmes: state.bmes.list,
  solutionCategories: state.categories.solution
});

export default connect(mapStateToProps, null)(EditStudyCasePage);
