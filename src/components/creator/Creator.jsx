import React from 'react';
import CreatorItem from 'components/creator/CreatorItem';
import PropTypes from 'prop-types';

export default function Creator(props) {
  const { title, items, onAdd, onEdit, onDelete, options, selectedField } = props;

  return (
    <section className="c-creator">
      <h1 className="creator-title">{title}</h1>
      <div className="row expanded">
        <div className="column small-2">Featured</div>
        <div className="column small-5">Bme</div>
        <div className="column small-5">Description</div>
      </div>
      {/* One CreatorItem per item filled with its data */}
      {items.map((item, i) => {
        return (
          <CreatorItem
            key={i}
            deleteable
            index={i}
            onEdit={onEdit}
            onDelete={onDelete}
            options={options}
            hidden={!!item._destroy} // eslint-disable-line no-underscore-dangle
            selected={item[selectedField]}
            description={item.description}
            selectedField={selectedField}
          />
        );
      })}
      {/* CreatorItem for adding new items */}
      <CreatorItem options={options} onAdd={(...args) => onAdd(...args)} selectedField={selectedField} />
    </section>
  );
}

Creator.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  onAdd: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  options: PropTypes.array,
  selectedField: PropTypes.string
};

Creator.defaultProps = {
  selectedField: 'id'
};
