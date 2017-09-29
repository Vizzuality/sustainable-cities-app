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
  getBlogs,
  deleteBlogs,
  setFilters,
  setBlogsSearch,
  resetBlogs
} from 'modules/blogs';

// selectors
import getParsedBlogDate from 'selectors/blog-date';

// constants
import { DEFAULT_SORT_FIELD, BLOGS_TABLE_FIELDS } from 'constants/blog';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class BlogsPage extends React.Component {

  componentWillMount() {
    const { sort, pagination } = this.props;
    const { pageSize, pageNumber } = pagination;
    dispatch(getBlogs({
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
      dispatch(getBlogs({
        pageSize: nextProps.pagination.pageSize,
        pageNumber: nextProps.pagination.pageNumber,
        sort: nextProps.sort,
        search: nextProps.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetBlogs());
  }

  deteleBlog(item) {
    const { pagination, sort } = this.props;
    const { pageSize, pageNumber } = pagination;

    dispatch(deleteBlogs({
      id: item.id,
      onSuccess() {
        dispatch(getBlogs({
          pageSize,
          pageNumber,
          sort,
          onSuccess: () => toastr.success('The blog has been removed succesfully')
        }));
      }
    }));
  }

  search = (val) => {
    dispatch(setBlogsSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    const { blogs, loading, pagination, itemCount } = this.props;

    return (
      <div className="c-page">
        <Link className="button" to="/blogs/new">New Blog</Link>
        <Search onChange={this.search} />
        <Table
          items={blogs}
          itemCount={itemCount}
          fields={BLOGS_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl="/blogs/edit"
          pagination={pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`Blog "${item.title}" will be deleted. Are you sure?`}
                onAccept={() => this.deteleBlog(item)}
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

BlogsPage.propTypes = {
  blogs: PropTypes.array,
  filters: PropTypes.object,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  itemCount: PropTypes.number,
  search: PropTypes.string,
  sort: PropTypes.string
};

BlogsPage.defaultProps = {
  sort: DEFAULT_SORT_FIELD
};

// Map state to props
const mapStateToProps = state => ({
  blogs: getParsedBlogDate(state),
  filters: state.blogs.filters,
  loading: state.blogs.loading,
  pagination: state.blogs.pagination,
  itemCount: state.blogs.itemCount,
  search: state.blogs.search,
  sort: state.blogs.sort
});

export default connect(mapStateToProps, null)(BlogsPage);
