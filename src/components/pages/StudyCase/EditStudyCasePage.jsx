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
import SourceForm from 'components/sources/SourceForm';

class EditStudyCasePage extends React.Component {

  /* Constructor */
  constructor(props) {
    super(props);

    this.form = {
      project_type: 'StudyCase'
    };

    this.state = {
      category_id: null,
      city: {},
      project_bmes_attributes: [],
      impacts_attributes: [],
      external_sources_attributes: []
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
    if ((!this.props.studyCases.included || !this.props.studyCases.included.length)
      && (nextProps.studyCases.included && nextProps.studyCases.included.length)) {
      this.setState({
        city: nextProps.studyCases.included
          .filter(sc => sc.type === 'cities')
          .map(c => ({ label: c.name, value: c.id }))[0],
        project_bmes_attributes: nextProps.studyCases.included
          .filter(sc => sc.type === 'project_bmes')
          .filter(pBme => !!pBme.relationships.bme.data)
          .map(pBme => ({ id: pBme.id, bme_id: pBme.relationships.bme.data.id, description: pBme.description })),
        impacts_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'impacts'),
        external_sources_attributes: nextProps.studyCases.included.filter(sc => sc.type === 'external_sources')
      });
    }

    if (this.props.studyCaseDetail !== nextProps.studyCaseDetail) {
      const category_id = `${nextProps.studyCaseDetail.category_id}`; // eslint-disable-line camelcase
      this.setState({ category_id });
    }
  }

  @Autobind
  onInputChange(evt) {
    this.form[evt.target.name] = evt.target.value;
  }

  @Autobind
  onImpactCreate(form) {
    this.setState({
      impacts_attributes: [...this.state.impacts_attributes, form]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  onImpactEdit(data, index) {
    const impacts_attributes = this.state.impacts_attributes.slice(); // eslint-disable-line camelcase
    impacts_attributes[index] = {
      ...impacts_attributes[index],
      ...data,
      edited: true
    };
    this.setState({ impacts_attributes });
    dispatch(toggleModal(false));
  }

  /* Methods */
  @Autobind
  submit(evt) {
    evt.preventDefault();

    const {
      city,
      category_id,
      impacts_attributes,
      project_bmes_attributes,
      external_sources_attributes
    } = this.state;

    const { operational_year } = this.form;
    delete this.form.operational_year;
    const operationalDate = new Date();
    operationalDate.setYear(operational_year);

    dispatch(updateStudyCase({
      id: this.props.studyCaseDetail.id,
      data: {
        ...this.form,
        city_ids: [city.value],
        category_id,
        // eslint-disable-next-line no-underscore-dangle
        impacts_attributes: impacts_attributes.filter(i => !i.id || i._destroy || i.edited),
        // eslint-disable-next-line no-underscore-dangle
        project_bmes_attributes: project_bmes_attributes.filter(pbme => !pbme.id || pbme.edited || pbme._destroy),
        // eslint-disable-next-line no-underscore-dangle
        external_sources_attributes: external_sources_attributes.filter(es => !es.id || es.edited || es._destroy),
        operational_year: operationalDate
      },
      onSuccess: () => {
        toastr.success('The study case has been edited');
        // dispatch(getStudyCases({ id: this.props.studyCases.detailId }));
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
  showImpactForm(evt, opts = {}) {
    evt.preventDefault();
    let values = {};
    let action = this.onImpactCreate;

    if (opts.edit) {
      values = this.state.impacts_attributes[opts.index];
      action = this.onImpactEdit;
    }

    dispatch(toggleModal(
      true,
      <ImpactForm text="Add" values={values} onSubmit={(...args) => action(...args, opts.index)} />
    ));
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

  /* External sources methods */

  @Autobind
  showSourceForm(evt, opts = {}) {
    evt.preventDefault();
    let values = {};
    let action = this.createSource;

    if (opts.edit) {
      values = this.state.external_sources_attributes[opts.index];
      action = this.editSource;
    }

    dispatch(toggleModal(
      true,
      <SourceForm text="Add" values={values} onSubmit={(...args) => action(...args, opts.index)} />
    ));
  }

  @Autobind
  createSource(data) {
    this.setState({
      external_sources_attributes: [...this.state.external_sources_attributes, data]
    });
    dispatch(toggleModal(false));
  }

  @Autobind
  editSource(data, index) {
    // eslint-disable-next-line camelcase
    const external_sources_attributes = this.state.external_sources_attributes.slice();
    external_sources_attributes[index] = {
      ...external_sources_attributes[index],
      ...data,
      edited: true
    };
    this.setState({ external_sources_attributes });
    dispatch(toggleModal(false));
  }

  @Autobind
  deleteSource(index) {
    const externalSources = this.props.studyCases.included.filter(sc => sc.type === 'external_sources');
    const sourceToDelete = this.state.external_sources_attributes[index];

    const exists = externalSources.find(i => i.id === sourceToDelete.id);
    const { external_sources_attributes } = this.state;

    if (!exists) {
      // Source still doesn't exist on database,
      // just remove it from local array
      external_sources_attributes.splice(index, 1);
    } else {
      // Source exists on database,
      // we have to delete it from there
      external_sources_attributes[index] = {
        id: sourceToDelete.id,
        _destroy: true
      };
    }

    this.setState({ external_sources_attributes });
  }

  /* Project bmes methods */

  @Autobind
  addProjectBme(pbme) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = [
      ...this.state.project_bmes_attributes,
      pbme
    ];
    this.setState({ project_bmes_attributes });
  }

  @Autobind
  editProjectBme(data, index) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = this.state.project_bmes_attributes.slice();
    project_bmes_attributes[index] = {
      ...project_bmes_attributes[index],
      ...data
    };

    if (project_bmes_attributes[index].id) {
      project_bmes_attributes[index].edited = true;
    }

    this.setState({ project_bmes_attributes });
  }

  @Autobind
  deleteProjectBme(index) {
    // eslint-disable-next-line camelcase
    const project_bmes_attributes = this.state.project_bmes_attributes.slice();
    const bmeToDelete = project_bmes_attributes[index];

    if (!bmeToDelete.id) {
      // Bme still doesn't exist on database,
      // just remove it from local array
      project_bmes_attributes.splice(index, 1);
    } else {
      // Bme exists on database,
      // we have to delete it from there using rails way (_destroy: true)
      project_bmes_attributes[index] = {
        id: bmeToDelete.id,
        _destroy: true
      };
    }

    this.setState({ project_bmes_attributes });
  }

  /* Render */
  render() {
    // Study case initial values
    const { studyCaseDetail } = this.props;
    const name = studyCaseDetail ? studyCaseDetail.name : '';
    const operationalYear = studyCaseDetail && studyCaseDetail.operational_year
      ? new Date(studyCaseDetail.operational_year).getFullYear()
      : '';
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
          <Input
            type="text"
            name="name"
            value={name}
            label="Study case title"
            validations={['required']}
            onChange={this.onInputChange}
          />
          <div className="row expanded">
            <div className="column small-6">
              {/* City */}
              <CitySearch
                name="city_ids"
                label="City"
                value={this.state.city}
                onChange={city => this.setState({ city })}
              />
            </div>
            <div className="column small-6">
              {/* Year */}
              <Input
                type="number"
                value={operationalYear}
                name="operational_year"
                onChange={this.onInputChange}
                label="Year"
                validations={['required']}
              />
            </div>
          </div>
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
          <Textarea
            name="situation"
            value={situation}
            label="situation"
            validations={[]}
            onChange={this.onInputChange}
          />
          <Creator
            title="BMEs"
            onAdd={this.addProjectBme}
            onEdit={this.editProjectBme}
            options={this.props.bmes.map(bme => ({ label: bme.name, value: bme.id }))}
            items={this.state.project_bmes_attributes}
            onDelete={this.deleteProjectBme}
            selectedField="bme_id"
          />
          {/* Impacts */}
          <div>
            <button type="button" className="button" onClick={this.showImpactForm}>Add Impact</button>
            <ul>
              {this.state.impacts_attributes.map((impact, i) => {
                return (
                  <li
                    key={impact.name}
                    className={`${impact._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button
                      onClick={evt => this.showImpactForm(evt, { edit: true, index: i })}
                    >
                      {impact.name || 'No name'}
                    </button>
                    <button type="button" className="button" onClick={() => this.deleteImpact(i)}>Delete</button>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* External sources */}
          <div>
            <button type="button" className="button" onClick={this.showSourceForm}>Add source</button>
            <ul>
              {this.state.external_sources_attributes.map((source, i) => {
                return (
                  <li
                    key={source.name}
                    className={`${source._destroy ? 'hidden' : ''}`} // eslint-disable-line no-underscore-dangle
                  >
                    <button onClick={evt => this.showSourceForm(evt, { edit: true, index: i })}>{source.name}</button>
                    <button type="button" className="button" onClick={() => this.deleteSource(i)}>Delete</button>
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
