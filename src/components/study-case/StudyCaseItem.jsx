import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default function StudyCaseItem({ data }) {
  console.log(data)
  const { name, id } = data;
  return (
    <Link className="c-sc" to={`/study-cases/edit/${id}`}>
      <div className="sc-img" style={{ backgroundImage: `url(${config['API_URL']}${data.photo_urls[0]})` }} />
      <div className="sc-name">{name}</div>
    </Link>
  );
}

StudyCaseItem.propTypes = {
  data: PropTypes.object
};
