import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';

export default function DropZone({ withImage, title, files, onDelete, ...props }) {
  const localOnDelete = i => (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(i);
    }
  };

  return (
    <div className="c-dropzone">
      <span className="dropzone-title">{title}</span>
      <Dropzone className="dropzone" activeClassName="active" rejectClassName="reject" {...props}>
        <ul className="dropzone-img-list">
          {files.map((file, i) => {
            return (
              <li className="img-item" key={file.name}>
                {withImage ? <img className="img" alt={file.name} src={file.attachment} /> : <span>{file.name}</span>}
                <button className="item-btn" onClick={localOnDelete(i)}><Icon name="icon-cross" /></button>
              </li>
            );
          })}
        </ul>
      </Dropzone>
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
