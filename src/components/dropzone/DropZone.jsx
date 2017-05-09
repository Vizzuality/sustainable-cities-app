import React from 'react';
import Dropzone from 'react-dropzone'
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';

export default function DropZone({ withImage, title, files, onDelete, ...props }) {
  return (
    <div className="c-dropzone">
      <span className="dropzone-title">{title}</span>
      <Dropzone {...props} />
      <ul className="dropzone-img-list">
        {files.map((file, i) => {
          return (
            <li className="img-item" key={i}>
              {withImage ? <img className="img" alt={file.name} src={file.attachment} /> : <span>{file.name}</span>}
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
  files: PropTypes.array,
  onDelete: PropTypes.func,
  withImage: PropTypes.bool
};

DropZone.defaultProps = {
  files: []
};
