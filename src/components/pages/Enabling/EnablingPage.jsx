import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import { getEnablings, deleteEnabling, setFilters, resetEnablings, setEnablingsSearch } from 'modules/enablings';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import Search from 'components/search/Search';
import { Autobind } from 'es-decorators';

import { DEFAULT_SORT_FIELD, ENABLINGS_TABLE_FIELDS } from 'constants/enablings';

class EnablingPage extends React.Component {

  componentWillMount() {
    dispatch(getEnablings());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.enablings;
    if (!isEqual(filters, nextProps.enablings.filters)
      || !isEqual(sort, nextProps.enablings.sort)
      || !isEqual(pagination, nextProps.enablings.pagination)
      || this.props.enablings.search !== nextProps.enablings.search) {
      dispatch(getEnablings({
        pageSize: nextProps.enablings.pagination.pageSize,
        pageNumber: nextProps.enablings.pagination.pageNumber,
        sort: nextProps.enablings.sort,
        search: nextProps.enablings.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetEnablings());
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

  @Autobind
  search(val) {
    dispatch(setEnablingsSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: 1,
      pageSize: 20
    }));
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/enabling-condition/new">New Enabling Condition</Link>
        <Search onChange={this.search} />
        <Table
          items={this.props.enablings.list}
          itemCount={this.props.enablings.itemCount}
          fields={ENABLINGS_TABLE_FIELDS}
          defaultSort={DEFAULT_SORT_FIELD}
          editUrl="/enabling-condition/edit"
          pagination={this.props.enablings.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = <Confirm text={`Enabling condition "${item.name}" will be deleted. Are you sure?`} onAccept={() => this.deleteEnabling(item)} />;
            dispatch(toggleModal(true, confirm));
          }}
        />
        <Spinner isLoading={this.props.enablings.loading} />
      </div>
    );
  }
}

EnablingPage.propTypes = {
  enablings: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ enablings }) => ({
  enablings
});

export default connect(mapStateToProps, null)(EnablingPage);
