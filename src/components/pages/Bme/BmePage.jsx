import React from 'react';
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


class BmePage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    // Fetch Bems
    dispatch(getBmes());
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination, search } = this.props.bmes;
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

  @Autobind
  search(val) {
    dispatch(setBmesSearch(val.toLowerCase()));
    dispatch(setFilters('pagination', {
      pageNumber: 1,
      pageSize: 20
    }));
  }

  render() {
    return (
      <div className="c-page">
        <Link className="button" to="/business-model-element/new">New Business Model Element</Link>
        <Search onChange={this.search} />
        <Table
          items={this.props.bmes.list}
          itemCount={this.props.bmes.itemCount}
          fields={['name', 'description']}
          defaultSort="name"
          sortableBy={['name']}
          editUrl="/business-model-element/edit"
          pagination={this.props.bmes.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = <Confirm text={`Business model element "${item.name}" will be deleted. Are you sure?`} onAccept={() => this.deleteBme(item)} />;
            dispatch(toggleModal(true, confirm));
          }}
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
