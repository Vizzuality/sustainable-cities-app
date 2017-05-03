import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';

import { getSolutions, deleteSolution, setFilters } from 'modules/solutions';

import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';

class SolutionPage extends React.Component {

  componentWillMount() {
    dispatch(getSolutions());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.solutions;
    if (!isEqual(filters, nextProps.solutions.filters)
      || !isEqual(sort, nextProps.solutions.sort)
      || !isEqual(pagination, nextProps.solutions.pagination)) {
      dispatch(getSolutions({
        pageSize: nextProps.solutions.pagination.pageSize,
        pageNumber: nextProps.solutions.pagination.pageNumber,
        sort: nextProps.solutions.sort
      }));
    }
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/solution/new">New Solution</Link>
        <Table
          items={this.props.solutions.list}
          itemCount={this.props.solutions.itemCount}
          fields={['name', 'category']}
          defaultSort="name"
          sortableBy={['name', 'category']}
          editUrl="/solution/edit"
          pagination={this.props.solutions.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={item => dispatch(deleteSolution({ id: item.id, onSuccess: () => toastr.success('The solution has been removed') }))}
        />
        <Spinner isLoading={this.props.solutions.loading} />
      </div>
    );
  }
}

SolutionPage.propTypes = {
  solutions: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ solutions }) => ({
  solutions
});

export default connect(mapStateToProps, null)(SolutionPage);
