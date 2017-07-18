import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';

export default function StudyCaseItem({ data }) {
  const { name, id, photo_urls } = data;
  const imageStyles = {
    backgroundImage: photo_urls[0] ? `url(${config['API_URL']}${data.photo_urls[0]})` : ''
  };
  return (
    <Link className="c-sc" to={`/study-cases/edit/${id}`}>
      <div className="sc-img" style={imageStyles} />
      <div className="sc-name">{name}</div>
    </Link>
  );
}

StudyCaseItem.propTypes = {
  data: PropTypes.object
};
