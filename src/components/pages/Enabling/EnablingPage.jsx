import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import { getEnablings, deleteEnabling, setFilters } from 'modules/enablings';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';

import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';

class EnablingPage extends React.Component {

  componentWillMount() {
    dispatch(getEnablings());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.enablings;
    if (!isEqual(filters, nextProps.enablings.filters)
      || !isEqual(sort, nextProps.enablings.sort)
      || !isEqual(pagination, nextProps.enablings.pagination)) {
      dispatch(getEnablings({
        pageSize: nextProps.enablings.pagination.pageSize,
        pageNumber: nextProps.enablings.pagination.pageNumber,
        sort: nextProps.enablings.sort
      }));
    }
  }

  deleteEnabling(item) {
    const { enablings } = this.props;

    dispatch(deleteEnabling({
      id: item.id,
      onSuccess() {
        dispatch(getEnablings({
          pageSize: enablings.pagination.pageSize,
          pageNumber: enablings.pagination.pageNumber,
          sort: enablings.sort,
          onSuccess: () => toastr.success('The enabling condition has been removed')
        }));
      }
    }));
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/enabling-condition/new">New Enabling Condition</Link>
        <Table
          items={this.props.enablings.list}
          itemCount={this.props.enablings.itemCount}
          fields={['name', 'category']}
          defaultSort="name"
          sortableBy={['name', 'category']}
          editUrl="/enabling-condition/edit"
          pagination={this.props.enablings.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={item => dispatch(toggleModal(true, <Confirm text={`Enabling condition "${item.name}" will be deleted. Are you sure?`} onAccept={() => this.deleteEnabling(item)} />))}
        />
        <Spinner isLoading={this.props.enablings.loading} />
      </div>
    );
  }
}

//this.deleteEnabling(item)

EnablingPage.propTypes = {
  enablings: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ enablings }) => ({
  enablings
});

export default connect(mapStateToProps, null)(EnablingPage);
