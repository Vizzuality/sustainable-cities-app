import React from 'react';
import CreatorItem from 'components/creator/CreatorItem';
import PropTypes from 'prop-types';

export default function Creator(props) {
  const { title, items, onAdd, onDelete, options, selectedField } = props;

  return (
    <section className="c-creator">
      <h1 className="creator-title">{title}</h1>
      <div className="row expanded">
        <div className="column small-5">Bme</div>
        <div className="column small-5">Description</div>
        <div className="column small-2">Featured</div>
      </div>
      {/* One CreatorItem per item filled with its data */}
      {items.map((item) => {
        return (
          <CreatorItem
            key={item.index}
            deleteable
            index={item.index}
            onDelete={onDelete}
            onSubmit={onAdd}
            options={options}
            hidden={!!item._destroy} // eslint-disable-line no-underscore-dangle
            selected={item[selectedField]}
            values={{
              is_featured: item.is_featured,
              description: item.description,
              bme_id: item.bme_id
            }}
            selectedField={selectedField}
          />
        );
      })}
      {/* CreatorItem for adding new items */}
      <CreatorItem adder options={options} values={{}} onSubmit={onAdd} selectedField={selectedField} />
    </section>
  );
}

Creator.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  options: PropTypes.array,
  selectedField: PropTypes.string
};

Creator.defaultProps = {
  selectedField: 'id'
};
