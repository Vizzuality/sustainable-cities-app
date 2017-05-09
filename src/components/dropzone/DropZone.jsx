import React from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types';

export default function DropZone({ title, onDrop, images }) {
  return (
    <div className="c-dropzone">
      <span className="dropzone-title">{title}</span>
      <Dropzone onDrop={onDrop} />
      <ul className="dropzone-img-list">
        {images.map((img, i) => <li className="img-item" key={i}><img className="img" alt={img.name} src={img.attachment} /></li>)}
      </ul>
    </div>
  );
}

DropZone.propTypes = {
  title: PropTypes.string,
  onDrop: PropTypes.func,
  images: PropTypes.array
};
