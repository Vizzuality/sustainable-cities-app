import React from 'react';
import PropTypes from 'prop-types';

export default class EntityContainer extends React.Component {

  onAdd() {
    if (this.props.items.length < this.props.maxItems) {
      this.props.onAdd();
    }
  }

  render() {
    return (
      <div className="c-entity-container">
        <ul className="entity-list">
          {this.props.items.map((Item, i) => <li key={i}><Item /></li>)}
        </ul>
        <button onClick={this.onAdd}>Add +</button>
      </div>
    );
  }
}

EntityContainer.propTypes = {
  items: PropTypes.array,
  maxItems: PropTypes.number,
  onAdd: PropTypes.func
};
