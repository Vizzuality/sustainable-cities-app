import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';
import BtnGroup from 'components/ui/BtnGroup';
import { DEFAULT_PAGINATION_NUMBER } from 'constants/table';
import { Link } from 'react-router';
import capitalize from 'lodash/capitalize';

export default class Table extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      sort: {
        direction: props.defaultSortDirection || this.defaultSortDirection,
        field: props.defaultSortField || null
      }
    };

    // initializes maxPagination value
    this.maxPagination = Math.ceil(this.props.itemCount / this.props.pagination.pageSize);
  }

  componentDidMount() {
    if (this.state.sort.field) {
      const { field, direction } = this.state.sort;
      this.props.onUpdateFilters('sort', direction === 1 ? field : `-${field}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    // updates maxPagination just if it's necessary
    if (this.props.itemCount !== nextProps.itemCount ||
      this.props.pagination.pageSize !== nextProps.pagination.pageSize) {
      this.maxPagination = Math.ceil(nextProps.itemCount / nextProps.pagination.pageSize);
    }
  }

  onChangePageNumber(e, pageNumber) {
    e.preventDefault();
    let nextPage = pageNumber;

    if (pageNumber < DEFAULT_PAGINATION_NUMBER) {
      nextPage = DEFAULT_PAGINATION_NUMBER;
    }

    if (pageNumber > this.maxPagination) {
      nextPage = this.maxPagination;
    }

    this.props.onUpdateFilters('pagination', { ...this.props.pagination, pageNumber: nextPage });
  }

  onSort(field) {
    const direction = -(this.state.sort.direction);
    const newSort = {
      direction,
      field
    };

    this.setState({
      sort: newSort
    });

    this.props.onUpdateFilters('sort', direction === 1 ? field : `-${field}`);
  }

  /* Partial renders */
  renderTableHead() {
    return (
      <tr>
        {this.props.fields.map((field) => {
          return (
            <th key={field.value}>{field.sortable ?
              <button onClick={() => this.onSort(field.value)}>
                {this.state.sort.field === field.value && <Icon
                  className="table-btn-icon -small"
                  name={this.state.sort.direction === 1 ? 'icon-arrow-up-2' : 'icon-arrow-down-2'}
                />}
                {capitalize(field.label)}
              </button> : capitalize(field.label)}
            </th>
          );
        })}
        <th>Edit / Delete</th>
      </tr>
    );
  }

  renderTableContent() {
    const { items, fields, editUrl, onDelete } = this.props;

    return items.map((item, index) => {
      return (
        <tr key={`${item}-${index}`}>
          {fields.map(field => <td key={field.value}>{item[field.value]}</td>)}
          <td>
            <BtnGroup>
              <Link to={`${editUrl}/${item.id}`} className="tiny button">Edit</Link>
              <button className="tiny button" onClick={() => onDelete && onDelete(item)}>Delete</button>
            </BtnGroup>
          </td>
        </tr>
      );
    });
  }

  renderPagination() {
    const { pageNumber } = this.props.pagination;
    return (
      <ul className="pagination" role="navigation">
        <li>
          <a
            href="#0"
            className={DEFAULT_PAGINATION_NUMBER === pageNumber ? 'disabled' : null}
            onClick={e => this.onChangePageNumber(e, DEFAULT_PAGINATION_NUMBER)}
          >
            &#60;&#60; First
          </a>
        </li>
        <li>
          <a
            href="#0"
            className={DEFAULT_PAGINATION_NUMBER === pageNumber ? 'disabled' : null}
            onClick={e => this.onChangePageNumber(e, pageNumber - 1)}
          >
            &#60; Prev
          </a>
        </li>
        <li>
          <a
            href="#0"
            className={this.maxPagination === pageNumber ? 'disabled' : null}
            onClick={e => this.onChangePageNumber(e, pageNumber + 1)}
          >
            Next &#62;
          </a>
        </li>
        <li>
          <a
            href="#0"
            className={this.maxPagination === pageNumber ? 'disabled' : null}
            onClick={e => this.onChangePageNumber(e, this.maxPagination)}
          >
            Last &#62;&#62;
          </a>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <div>
        {this.renderPagination()}
        <table className="c-table">
          <thead>
            {this.renderTableHead()}
          </thead>
          <tbody>
            {this.renderTableContent()}
          </tbody>
        </table>
        {this.renderPagination()}
      </div>
    );
  }
}

Table.propTypes = {
  defaultSortField: PropTypes.string,
  defaultSortDirection: PropTypes.number,
  items: PropTypes.array,
  itemCount: PropTypes.number,
  fields: PropTypes.array,
  editUrl: PropTypes.string,
  /* Filters */
  pagination: PropTypes.object,
  /* Callbacks */
  onDelete: PropTypes.func,
  onUpdateFilters: PropTypes.func
};

Table.defaultProps = {
  items: [],
  defaultSortDirection: 1 // ASC
};
