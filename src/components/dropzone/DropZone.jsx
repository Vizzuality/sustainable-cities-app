import React from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';

export default function DropZone({ title, images, onDelete, ...props }) {
  return (
    <div className="c-dropzone">
      <span className="dropzone-title">{title}</span>
      <Dropzone {...props} />
      <ul className="dropzone-img-list">
        {images.map((img, i) => {
          return (
            <li className="img-item" key={i}><img className="img" alt={img.name} src={img.attachment} />
              <button className="item-btn" onClick={() => onDelete && onDelete(i)}><Icon name="icon-cross" /></button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

DropZone.propTypes = {
  title: PropTypes.string,
  images: PropTypes.array,
  onDelete: PropTypes.func
};

DropZone.defaultProps = {
  images: []
};
