import React from 'react';
import isEqual from 'lodash/isEqual';
import Icon from 'components/ui/Icon';

export default class Table extends React.Component {

  constructor(props) {
    super(props);

    /* Initial state */
    this.state = {
      items: props.items,
      sort: {
        field: props.defaultSort,
        direction: -1
      }
    };
  }

  /* Lifecycle */
  componentWillReceiveProps(newProps) {
    if (!isEqual(this.state.items, newProps.items)) {
      this.setState({
        items: newProps.items
      });
    }
  }

  /* Methods */
  sort(field) {
    this.setState({
      sort: {
        field,
        direction: this.state.sort.direction * -1
      }
    });
  }

  /* Partial renders */
  renderTableHead() {
    return (
      <tr>
        {this.props.fields.map((field, i) => {
          return (
            <th key={i}>{this.props.sortableBy.includes(field) ?
              <button className="table-btn" onClick={() => this.sort(field)} >
                <Icon className="table-btn-icon -small" name={this.state.sort.direction === 1 ? 'icon-arrow-up-2' : 'icon-arrow-down-2'} />{field}
              </button> : field}
            </th>
          );
        })}
      </tr>
    );
  }

  renderTableContent() {
    const { items, sort } = this.state;

    if (sort.field) {
      // Sort items
      items.sort((prev, next) => (prev.attributes[sort.field].toString() < next.attributes[sort.field].toString() ? sort.direction : (sort.direction * -1)));
    }

    return items.map((item, index) => {
      return <tr key={index}>{this.props.fields.map((field, i) => <td key={i}>{item.attributes[field]}</td>)}</tr>;
    });
  }

  render() {
    return (
      <table className="c-table">
        <thead>
          {this.renderTableHead()}
        </thead>
        <tbody>
          {this.renderTableContent()}
        </tbody>
      </table>
    );
  }
}

Table.propTypes = {
  items: React.PropTypes.array,
  fields: React.PropTypes.array,
  sortableBy: React.PropTypes.array,
  defaultSort: React.PropTypes.string
};
