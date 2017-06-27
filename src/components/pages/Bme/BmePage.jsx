import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { getBmes, deleteBme, setFilters, setBmesSearch, resetBmes } from 'modules/bmes';
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

import { DEFAULT_SORT_FIELD, BME_TABLE_FIELDS } from 'constants/bmes';
import { DEFAULT_PAGINATION_NUMBER, DEFAULT_PAGINATION_SIZE } from 'constants/table';

class BmePage extends React.Component {

  componentWillMount() {
    // Fetch Bems
    dispatch(getBmes());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.bmes;
    if (!isEqual(filters, nextProps.bmes.filters)
      || !isEqual(sort, nextProps.bmes.sort)
      || !isEqual(pagination, nextProps.bmes.pagination)
      || this.props.bmes.search !== nextProps.bmes.search) {
      dispatch(getBmes({
        pageSize: nextProps.bmes.pagination.pageSize,
        pageNumber: nextProps.bmes.pagination.pageNumber,
        sort: nextProps.bmes.sort,
        search: nextProps.bmes.search
      }));
    }
  }

  componentWillUnmount() {
    dispatch(resetBmes());
  }

  setCategory() {
    return this.props.bmes.list.map((bme) => {
      if (!bme.categories.length) return { bme };
      const category = bme.categories.find(cat => cat.category_type === 'Bme');
      return {
        ...bme,
        ...{ category: category ? category.name : '-' }
      };
    });
  }

  @Autobind
  search(val) {
    dispatch(setBmesSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: DEFAULT_PAGINATION_NUMBER,
      pageSize: DEFAULT_PAGINATION_SIZE
    }));
  }

  deleteBme(bme) {
    const { bmes } = this.props;

    dispatch(
      deleteBme({
        id: bme.id,
        onSuccess: () => {
          dispatch(getBmes({
            pageSize: bmes.pagination.pageSize,
            pageNumber: bmes.pagination.pageNumber,
            sort: bmes.sort,
            onSuccess: () => toastr.success('The business model elemen has been removed')
          }));
        }
      })
    );
  }

  render() {
    let bmes = [];

    if (this.props.bmes.list.length) {
      bmes = this.setCategory();
    }

    return (
      <div className="c-page">
        <Link className="button" to="/business-model-element/new">New Business Model Element</Link>
        <Search onChange={this.search} />
        <Table
          items={bmes}
          itemCount={this.props.bmes.itemCount}
          fields={BME_TABLE_FIELDS}
          defaultSortField={DEFAULT_SORT_FIELD}
          editUrl="/business-model-element/edit"
          pagination={this.props.bmes.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = (
              <Confirm
                text={`Business model element "${item.name}" will be deleted. Are you sure?`}
                onAccept={() => this.deleteBme(item)}
              />
            );
            dispatch(toggleModal(true, confirm));
          }}
        />
        <Spinner isLoading={this.props.bmes.loading} />
      </div>
    );
  }
}

BmePage.propTypes = {
  bmes: PropTypes.object
};

// Map state to props
const mapStateToProps = ({ bmes }) => ({
  bmes
});

export default connect(mapStateToProps, null)(BmePage);
