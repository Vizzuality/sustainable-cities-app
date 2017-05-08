import React from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types';

export default function DropZone({ title, onDrop, images }) {
  return (
    <div className="c-dropzone">
      <span className="dropzone-title">{title}</span>
      <Dropzone onDrop={onDrop} />
      <ul>
        {images.map((img, i) => <li key={i}><img alt={img.name} src={img.preview} /></li>)}
      </ul>
    </div>
  );
}

DropZone.propTypes = {
  title: PropTypes.string,
  onDrop: PropTypes.func,
  images: PropTypes.array
};
