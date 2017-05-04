import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dispatch } from 'main';
import { toastr } from 'react-redux-toastr';
import isEqual from 'lodash/isEqual';

import { getImpacts, deleteImpact, setFilters } from 'modules/impacts';
import { getCategories } from 'modules/categories';
import { toggleModal } from 'modules/modal';
import { getIdRelations } from 'utils/relation';

import Confirm from 'components/confirm/Confirm';
import Spinner from 'components/ui/Spinner';
import Table from 'components/ui/Table';

class EnablingPage extends React.Component {

  componentWillMount() {
    dispatch(getImpacts());
    dispatch(getCategories({ type: 'impact', tree: false }))
  }

  componentWillReceiveProps(nextProps) {
    const { filters, sort, pagination } = this.props.impacts;
    if (!isEqual(filters, nextProps.impacts.filters)
      || !isEqual(sort, nextProps.impacts.sort)
      || !isEqual(pagination, nextProps.impacts.pagination)) {
      dispatch(getImpacts({
        pageSize: nextProps.impacts.pagination.pageSize,
        pageNumber: nextProps.impacts.pagination.pageNumber,
        sort: nextProps.impacts.sort
      }));
    }
  }

  setCategory() {
    return this.props.impacts.list.map((imp) => {
      if (!imp.relationships.category.data) return {};
      const category = getIdRelations([imp.relationships.category.data], this.props.impactCategories);
      return {
        ...imp,
        ...{ category: category ? category[0].name : '-' }
      };
    });
  }

  deleteImpact(impact) {
    const { impacts } = this.props;

    dispatch(
      deleteImpact({
        id: impact.id,
        onSuccess: () => {
          dispatch(getImpacts({
            pageSize: impacts.pagination.pageSize,
            pageNumber: impacts.pagination.pageNumber,
            sort: impacts.sort,
            onSuccess: () => toastr.success('The impact has been removed')
          }));
        }
      })
    );
  }


  render() {
    let impacts = null;

    if (this.props.impacts.list.length && this.props.impactCategories && this.props.impactCategories.length) {
      impacts = this.setCategory();
    }

    if (!impacts) return null;

    return (
      <div className="c-page">
        <Link className="button" to="/impact/new">New Impact</Link>
        <Table
          items={impacts}
          itemCount={this.props.impacts.itemCount}
          fields={['name', 'category', 'impact_unit', 'impact_value']}
          defaultSort="name"
          sortableBy={['name', 'category', 'impact_unit', 'impact_value']}
          editUrl="/impact/edit"
          pagination={this.props.impacts.pagination}
          onUpdateFilters={(field, value) => { dispatch(setFilters(field, value)); }}
          onDelete={(item) => {
            const confirm = <Confirm text={`Impact "${item.name}" will be deleted. Are you sure?`} onAccept={() => this.deleteImpact(item)} />;
            dispatch(toggleModal(true, confirm));
          }}
        />
        <Spinner isLoading={this.props.impacts.loading} />
      </div>
    );
  }
}

EnablingPage.propTypes = {
  impacts: PropTypes.object,
  impactCategories: PropTypes.array
};

// Map state to props
const mapStateToProps = ({ impacts, categories }) => ({
  impacts,
  impactCategories: categories.impact
});

export default connect(mapStateToProps, null)(EnablingPage);
