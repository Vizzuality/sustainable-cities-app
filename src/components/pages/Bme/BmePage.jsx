import React from 'react';
import { Link } from 'react-router';
import { getBmes, deleteBme, setFilters } from 'modules/bmes';
import { dispatch } from 'main';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';


class BmePage extends React.Component {

  componentWillMount() {
    // Fetch Bems
    dispatch(getBmes());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.bmes;
    if (!isEqual(filters, nextProps.bmes.filters)
      || !isEqual(sort, nextProps.bmes.sort)
      || !isEqual(pagination, nextProps.bmes.pagination)) {
      dispatch(getBmes({
        pageSize: nextProps.bmes.pagination.pageSize,
        pageNumber: nextProps.bmes.pagination.pageNumber,
        sort: nextProps.bmes.sort
      }));
    }
  }

  render() {
    return (
      <div className="c-page">
        <Link className="c-btn -primary" to="/business-model-element/new">New Business Model Element</Link>
        <Table
          items={this.props.bmes.list}
          fields={['name', 'description']}
          defaultSort="name"
          sortableBy={['name']}
          editUrl="/business-model-element/edit"
          pagination={this.props.bmes.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={item => dispatch(deleteBme({ id: item.id, onSuccess: () => toastr.success('The business model elemen has been removed') }))}
        />
        <Spinner isLoading={this.props.bmes.loading} />
      </div>
    );
  }
}

BmePage.propTypes = {
  // State
  bmes: React.PropTypes.object
};

// Map state to props
const mapStateToProps = ({ bmes }) => ({
  bmes
});

export default connect(mapStateToProps, null)(BmePage);
