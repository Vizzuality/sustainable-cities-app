import React from 'react';
import Proptypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { toastr } from 'react-redux-toastr';
import { dispatch } from 'main';
import { Autobind } from 'es-decorators';
import isEqual from 'lodash/isEqual';

import { getCategories, deleteCategory, setCategoriesSearch, setFilters } from 'modules/categories';
import { toggleModal } from 'modules/modal';

import Table from 'components/ui/Table';
import Spinner from 'components/ui/Spinner';
import Search from 'components/search/Search';
import Confirm from 'components/confirm/Confirm';

import {
  CATEGORY_TABLE_FIELDS,
  DEFAULT_SORT_FIELD,
  NEW_CATEGORY_URL,
  EDIT_CATEGORY_URL
} from 'constants/categories';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class CategoryPage extends React.Component {

  componentWillMount() {
    dispatch(getCategories({ type: 'all' }));
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination, search } = this.props.categories;
    if (!isEqual(filters, nextProps.categories.filters)
      || !isEqual(sort, nextProps.categories.sort)
      || !isEqual(pagination, nextProps.categories.pagination)
      || search !== nextProps.categories.search) {
      dispatch(getCategories({
        type: 'all',
        pageSize: nextProps.categories.pagination.pageSize,
        pageNumber: nextProps.categories.pagination.pageNumber,
        sort: nextProps.categories.sort,
        search: nextProps.categories.search
      }));
    }
  }

  onDeleteCategory(category) {
    const { categories } = this.props;

    dispatch(
      deleteCategory({
        id: category.id,
        onSuccess: () => {
          dispatch(getCategories({
            type: 'all',
            pageSize: categories.pagination.pageSize,
            pageNumber: categories.pagination.pageNumber,
            sort: categories.sort,
            onSuccess: () => toastr.success('The category has been removed')
          }));
        }
      })
    );
  }

  @Autobind
  search(val) {
    dispatch(setCategoriesSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to={NEW_CATEGORY_URL}>New Category</Link>
        <Search onChange={this.search} />
        <Table
          items={this.props.categoryEntities}
          itemCount={this.props.categories.itemCount}
          fields={CATEGORY_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl={EDIT_CATEGORY_URL}
          pagination={this.props.categories.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`Category "${item.name}" will be deleted. Are you sure?`}
                onAccept={() => this.onDeleteCategory(item)}
              />
            );
            dispatch(toggleModal(true, confirm));
          }}
        />
        <Spinner isLoading={this.props.categories.loading} />
      </div>
    );
  }
}

CategoryPage.propTypes = {
  categories: Proptypes.object,
  categoryEntities: Proptypes.array
};

const mapStateToProps = ({ categories }) => ({
  categories,
  categoryEntities: categories.all
});

export default connect(mapStateToProps, null)(CategoryPage);
