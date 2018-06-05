import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';
import { getCities, deleteCity, setFilters, setCitySearch, resetCities } from 'modules/cities';
import { toggleModal } from 'modules/modal';
import Confirm from 'components/confirm/Confirm';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';
import Search from 'components/search/Search';

import { DEFAULT_SORT_FIELD, CITY_TABLE_FIELDS } from 'constants/cities';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class CityPage extends React.Component {

  componentWillMount() {
    const { sort, pagination } = this.props;
    const { pageSize, pageNumber } = pagination;
    dispatch(getCities({
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
      dispatch(getCities({
        pageSize: nextProps.pagination.pageSize,
        pageNumber: nextProps.pagination.pageNumber,
        sort: nextProps.sort,
        search: nextProps.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetCities());
  }

  deteleCity(item) {
    const { pagination, sort } = this.props;
    const { pageSize, pageNumber } = pagination;

    dispatch(deleteCity({
      id: item.id,
      onSuccess() {
        dispatch(getCities({
          pageSize,
          pageNumber,
          sort,
          onSuccess: () => toastr.success('The city has been removed succesfully')
        }));
      }
    }));
  }

  search = (val) => {
    dispatch(setCitySearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    const { cities, loading, pagination, itemCount } = this.props;
    return (
      <div className="c-page">
        <Link className="button" to="/backoffice/cities/new">New City</Link>
        <Search onChange={this.search} />
        <Table
          items={cities}
          itemCount={itemCount}
          fields={CITY_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl="/backoffice/cities/edit"
          pagination={pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`City "${item.name}" will be deleted. Are you sure?`}
                onAccept={() => this.deteleCity(item)}
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

CityPage.propTypes = {
  cities: PropTypes.array,
  filters: PropTypes.object,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  itemCount: PropTypes.number,
  search: PropTypes.string,
  sort: PropTypes.string
};

CityPage.defaultProps = {
  sort: DEFAULT_SORT_FIELD
};

// Map state to props
const mapStateToProps = ({ cities }) => ({
  cities: cities.list,
  filters: cities.filters,
  loading: cities.loading,
  pagination: cities.pagination,
  itemCount: cities.itemCount,
  search: cities.search,
  sort: cities.sort
});

export default connect(mapStateToProps, null)(CityPage);
