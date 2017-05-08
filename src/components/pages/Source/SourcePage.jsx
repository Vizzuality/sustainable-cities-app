import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { getSources, deleteSource, setFilters, setSourcesSearch, resetSources } from 'modules/sources';
import { dispatch } from 'main';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import Search from 'components/search/Search';
import { Autobind } from 'es-decorators';

import { DEFAULT_SORT_FIELD, SOURCES_TABLE_FIELDS } from 'constants/sources';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class SourcePage extends React.Component {

  componentWillMount() {
    // fetch sources
    dispatch(getSources());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination, search } = this.props.sources;
    if (!isEqual(filters, nextProps.sources.filters)
      || !isEqual(sort, nextProps.sources.sort)
      || !isEqual(pagination, nextProps.sources.pagination)
      || search !== nextProps.sources.search) {
      dispatch(getSources({
        pageSize: nextProps.sources.pagination.pageSize,
        pageNumber: nextProps.sources.pagination.pageNumber,
        sort: nextProps.sources.sort,
        search: nextProps.sources.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetSources());
  }

  deleteSource(source) {
    const { sources } = this.props;

    dispatch(
      deleteSource({
        id: source.id,
        onSuccess: () => {
          dispatch(getSources({
            pageSize: sources.pagination.pageSize,
            pageNumber: sources.pagination.pageNumber,
            sort: sources.sort,
            onSuccess: () => toastr.success('The source has been removed')
          }));
        }
      })
    );
  }

  @Autobind
  search(val) {
    dispatch(setSourcesSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/source/new">New Source</Link>
        <Search onChange={this.search} />
        <Table
          items={this.props.sources.list}
          itemCount={this.props.sources.itemCount}
          fields={SOURCES_TABLE_FIELDS}
          defaultSort={DEFAULT_SORT_FIELD}
          editUrl="/source/edit"
          pagination={this.props.sources.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = <Confirm text={`Source "${item.name}" will be deleted. Are you sure?`} onAccept={() => this.deleteSource(item)} />;
            dispatch(toggleModal(true, confirm));
          }}
        />
        <Spinner isLoading={this.props.sources.loading} />
      </div>
    );
  }
}

SourcePage.propTypes = {
  sources: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ sources }) => ({
  sources
});

export default connect(mapStateToProps, null)(SourcePage);
