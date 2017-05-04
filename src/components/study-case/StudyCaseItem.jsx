import React from 'react';

export default function StudyCaseItem({ data }) {
  const { name, solution } = data;
  return (
    <div className="c-sc">
      <div className="sc-img" />
      <div className="sc-name">{name}</div>
    </div>
  );
}

StudyCaseItem.propTypes = {
  data: React.PropTypes.object
};
