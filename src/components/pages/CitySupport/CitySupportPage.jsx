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
  getCitySupport,
  deleteCitySupport,
  setFilters,
  setCitySupportSearch,
  resetCitySupport
} from 'modules/city-support';

// selectors
import getParsedCitySupportDate from 'selectors/city-support-date';

// constants
import { DEFAULT_SORT_FIELD, CITY_SUPPORT_TABLE_FIELDS } from 'constants/city-support';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class CitySupportPage extends React.Component {

  componentWillMount() {
    const { sort, pagination } = this.props;
    const { pageSize, pageNumber } = pagination;
    dispatch(getCitySupport({
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
      dispatch(getCitySupport({
        pageSize: nextProps.pagination.pageSize,
        pageNumber: nextProps.pagination.pageNumber,
        sort: nextProps.sort,
        search: nextProps.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetCitySupport());
  }

  deteleCitySupport(item) {
    const { pagination, sort } = this.props;
    const { pageSize, pageNumber } = pagination;

    dispatch(deleteCitySupport({
      id: item.id,
      onSuccess() {
        dispatch(getCitySupport({
          pageSize,
          pageNumber,
          sort,
          onSuccess: () => toastr.success('City support has been removed succesfully')
        }));
      }
    }));
  }

  search = (val) => {
    dispatch(setCitySupportSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    const { citiesSupport, loading, pagination, itemCount } = this.props;

    return (
      <div className="c-page">
        <Link className="button" to="/backoffice/city-supports/new">New City Support</Link>
        <Search onChange={this.search} />
        <Table
          items={citiesSupport}
          itemCount={itemCount}
          fields={CITY_SUPPORT_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl="/backoffice/city-supports/edit"
          pagination={pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`City support "${item.title}" will be deleted. Are you sure?`}
                onAccept={() => this.deteleCitySupport(item)}
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

CitySupportPage.propTypes = {
  citiesSupport: PropTypes.array,
  filters: PropTypes.object,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  itemCount: PropTypes.number,
  search: PropTypes.string,
  sort: PropTypes.string
};

CitySupportPage.defaultProps = {
  sort: DEFAULT_SORT_FIELD
};

// Map state to props
const mapStateToProps = state => ({
  citiesSupport: getParsedCitySupportDate(state),
  filters: state.citySupport.filters,
  loading: state.citySupport.loading,
  pagination: state.citySupport.pagination,
  itemCount: state.citySupport.itemCount,
  search: state.citySupport.search,
  sort: state.citySupport.sort
});

export default connect(mapStateToProps, null)(CitySupportPage);
