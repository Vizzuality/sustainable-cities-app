import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';

import { getImpacts, deleteImpact, setFilters } from 'modules/impacts';

import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';

class EnablingPage extends React.Component {

  componentWillMount() {
    dispatch(getImpacts());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.impacts;
    if (!isEqual(filters, nextProps.impacts.filters)
      || !isEqual(sort, nextProps.impacts.sort)
      || !isEqual(pagination, nextProps.impacts.pagination)) {
      dispatch(getImpacts({
        pageSize: nextProps.impacts.pagination.pageSize,
        pageNumber: nextProps.impacts.pagination.pageNumber,
        sort: nextProps.impacts.sort
      }));
    }
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/impact/new">New Impact</Link>
        <Table
          items={this.props.impacts.list}
          itemCount={this.props.impacts.itemCount}
          fields={['name', 'category', 'unit', 'value']}
          defaultSort="name"
          sortableBy={['name', 'category', 'unit', 'value']}
          editUrl="/impact/edit"
          pagination={this.props.impacts.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={item => dispatch(deleteImpact({ id: item.id, onSuccess: () => toastr.success('The business model elemen has been removed') }))}
        />
        <Spinner isLoading={this.props.impacts.loading} />
      </div>
    );
  }
}

EnablingPage.propTypes = {
  impacts: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ impacts }) => ({
  impacts
});

export default connect(mapStateToProps, null)(EnablingPage);
