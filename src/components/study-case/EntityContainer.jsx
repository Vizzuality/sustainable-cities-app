import React from 'react';
import PropTypes from 'prop-types';

export default class EntityContainer extends React.Component {

  onSaveItemStatus(status) {
    console.log(status);

    if (status) {
      if (this.props.items.length < this.props.maxItems) {
        this.props.onAdd();
      }
    }
  }

  render() {
    return (
      <div className="c-entity-container">
        <ul className="entity-list">
          {this.props.items.map((Item, i) =>
            <li key={i}><Item onSave={status => this.onSaveItemStatus(status)} /></li>
          )}
        </ul>
      </div>
    );
  }
}

EntityContainer.propTypes = {
  items: PropTypes.array,
  maxItems: PropTypes.number,
  onAdd: PropTypes.func
};
