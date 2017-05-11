import React from 'react';
import { Link } from 'react-router';

export default function StudyCaseItem({ data }) {
  const { name, id } = data;
  return (
    <Link className="c-sc" to={`/study-cases/edit/${id}`}>
      <div className="sc-img" />
      <div className="sc-name">{name}</div>
    </Link>
  );
}

StudyCaseItem.propTypes = {
  data: React.PropTypes.object
};
