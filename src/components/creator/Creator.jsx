import React from 'react';
import CreatorItem from 'components/creator/CreatorItem';
import PropTypes from 'prop-types';

export default function Creator({ title, items, onAdd }) {

  function _onAdd(evt) {
    evt.preventDefault();
    onAdd && onAdd(1);
  }

  return (
    <section className="c-creator">
      <h1 className="creator-title">{title}</h1>
      <CreatorItem />
      {items.map((item, index) => <CreatorItem key={index} />)}
      <button onClick={_onAdd} className="button">Add new</button>
    </section>
  );
}

Creator.propTypes = {
  title: PropTypes.string,
  items: PropTypes.array,
  onAdd: PropTypes.func
};
