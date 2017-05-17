import React from 'react';
import CreatorItem from 'components/creator/CreatorItem';
import PropTypes from 'prop-types';

export default class Creator extends React.Component {

  render() {
    const { title, items, onAdd, onEdit, onDelete, options } = this.props;
    return (
      <section className="c-creator">
        <h1 className="creator-title">{title}</h1>
        <div className="row expanded">
          <div className="column small-6">Bme</div>
          <div className="column small-6">Description</div>
        </div>
        {items.map((item, i) => <CreatorItem key={i} deleteable index={i} onEdit={onEdit} onDelete={onDelete} options={options} selected={item.id} description={item.description} />)}
        <CreatorItem options={options} onAdd={(...args) => onAdd(...args)} />
      </section>
    );
  }
}

Creator.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  options: PropTypes.array
};
