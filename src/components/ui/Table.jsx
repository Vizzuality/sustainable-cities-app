import React from 'react';
import Icon from 'components/ui/Icon';
import BtnGroup from 'components/ui/BtnGroup';
import { DEFAULT_PAGINATION_NUMBER } from 'constants/bmes';
import { Link } from 'react-router';
import capitalize from 'lodash/capitalize';

export default class Table extends React.Component {

  constructor(props) {
    super(props);

    /* Initial state */
    this.state = {
      sortDirection: 1
    };

    // initializes maxPagination value
    this.maxPagination = Math.ceil(this.props.itemCount / this.props.pagination.pageSize);
  }

  componentWillReceiveProps(nextProps) {
    // updates maxPagination just if it's necessary
    if (this.props.itemCount !== nextProps.itemCount ||
      this.props.pagination.pageSize !== nextProps.pagination.pageSize) {
      this.maxPagination = Math.ceil(nextProps.itemCount / nextProps.pagination.pageSize);
    }
  }

  onChangePageNumber(pageNumber) {
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
    const sortDirection = -(this.state.sortDirection);
    this.setState({
      sortDirection
    });

    this.props.onUpdateFilters('sort', sortDirection === 1 ? field : `-${field}`);
  }

  /* Partial renders */
  renderTableHead() {
    return (
      <tr>
        {this.props.fields.map((field, i) => {
          return (
            <th key={i}>{this.props.sortableBy.includes(field) ?
              <a onClick={() => this.onSort(field)} >
                <Icon className="table-btn-icon -small" name={this.state.sortDirection === 1 ? 'icon-arrow-up-2' : 'icon-arrow-down-2'} />{capitalize(field)}
              </a> : capitalize(field)}
            </th>
          );
        })}
        <th>Edit / Delete</th>
      </tr>
    );
  }

  renderTableContent() {
    const { items } = this.props;

    return items.map((item, index) => {
      return (
        <tr key={index}>
          {this.props.fields.map((field, i) => <td key={i}>{item[field]}</td>)}
          <td>
            <BtnGroup>
              <Link to={`${this.props.editUrl}/${item.id}`} className="tiny button">Edit</Link>
              <button className="tiny button" onClick={() => this.props.onDelete && this.props.onDelete(item)}>Delete</button>
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
        <li><a href="#0" className={DEFAULT_PAGINATION_NUMBER === pageNumber ? 'disabled' : null} onClick={() => this.onChangePageNumber(DEFAULT_PAGINATION_NUMBER)}>&#60;&#60; First</a></li>
        <li><a href="#0" className={DEFAULT_PAGINATION_NUMBER === pageNumber ? 'disabled' : null} onClick={() => this.onChangePageNumber(pageNumber - 1)}>&#60; Prev</a></li>
        <li><a href="#0" className={this.maxPagination === pageNumber ? 'disabled' : null} onClick={() => this.onChangePageNumber(pageNumber + 1)}>Next &#62;</a></li>
        <li><a href="#0" className={this.maxPagination === pageNumber ? 'disabled' : null} onClick={() => this.onChangePageNumber(this.maxPagination)}>Last &#62;&#62;</a></li>
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
  items: React.PropTypes.array,
  itemCount: React.PropTypes.number,
  fields: React.PropTypes.array,
  sortableBy: React.PropTypes.array,
  editUrl: React.PropTypes.string,
  /* Filters */
  pagination: React.PropTypes.object,
  /* Callbacks */
  onDelete: React.PropTypes.func,
  onUpdateFilters: React.PropTypes.func
};
