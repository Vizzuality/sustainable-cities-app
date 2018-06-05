import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import Search from 'components/search/Search';

// modules
import {
  getEvents,
  deleteEvents,
  setFilters,
  setEventsSearch,
  resetEvents
} from 'modules/events';

// selectors
import getParsedEventDate from 'selectors/event-date';

// constants
import { DEFAULT_SORT_FIELD, EVENT_TABLE_FIELDS } from 'constants/event';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class EventsPage extends React.Component {

  componentWillMount() {
    const { sort, pagination } = this.props;
    const { pageSize, pageNumber } = pagination;
    dispatch(getEvents({
      pageNumber,
      pageSize,
      sort
    }));
  }

  componentWillReceiveProps(nextProps) {
    const { filters, pagination, search, sort } = this.props;
    const filtersChanged = !isEqual(filters, nextProps.filters);
    const SortingChanged = !isEqual(sort, nextProps.sort);
    const paginationChanged = !isEqual(pagination, nextProps.pagination);
    const searchChanged = search !== nextProps.search;

    if (filtersChanged || SortingChanged || paginationChanged || searchChanged) {
      dispatch(getEvents({
        pageSize: nextProps.pagination.pageSize,
        pageNumber: nextProps.pagination.pageNumber,
        sort: nextProps.sort,
        search: nextProps.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetEvents());
  }

  deteleEvent(item) {
    const { pagination, sort } = this.props;
    const { pageSize, pageNumber } = pagination;

    dispatch(deleteEvents({
      id: item.id,
      onSuccess() {
        dispatch(getEvents({
          pageSize,
          pageNumber,
          sort,
          onSuccess: () => toastr.success('The event has been removed succesfully')
        }));
      }
    }));
  }

  search = (val) => {
    dispatch(setEventsSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    const { events, loading, pagination, itemCount } = this.props;

    return (
      <div className="c-page">
        <Link className="button" to="/backoffice/events/new">New Event</Link>
        <Search onChange={this.search} />
        <Table
          items={events}
          itemCount={itemCount}
          fields={EVENT_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl="/backoffice/events/edit"
          pagination={pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`Event "${item.title}" will be deleted. Are you sure?`}
                onAccept={() => this.deteleEvent(item)}
              />
            );
            dispatch(toggleModal(true, confirm));
          }}
        />
        {loading && <Spinner isLoading />}
      </div>
    );
  }
}

EventsPage.propTypes = {
  events: PropTypes.array,
  filters: PropTypes.object,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  itemCount: PropTypes.number,
  search: PropTypes.string,
  sort: PropTypes.string
};

EventsPage.defaultProps = {
  sort: DEFAULT_SORT_FIELD
};

// Map state to props
const mapStateToProps = state => ({
  events: getParsedEventDate(state),
  filters: state.events.filters,
  loading: state.events.loading,
  pagination: state.events.pagination,
  itemCount: state.events.itemCount,
  search: state.events.search,
  sort: state.events.sort
});

export default connect(mapStateToProps, null)(EventsPage);
