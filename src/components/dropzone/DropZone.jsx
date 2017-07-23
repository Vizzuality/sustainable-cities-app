import React from 'react';
import Dropzone from 'react-dropzone';
import PropTypes from 'prop-types';
import Icon from 'components/ui/Icon';
import { toastr } from 'react-redux-toastr';
import { toBase64 } from 'utils/base64';

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
              <li className="img-item" key={[file.id, file.name].join('-')}>
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

DropZone.defaultFilesFromPhotos = (self, field) =>
  self.state[field]
    .filter(f => !f._destroy) // eslint-disable-line no-underscore-dangle
    .map(f => ({
      id: f.id,
      name: f.name,
      attachment: f.attachment.url ?
        `${config.API_URL}${f.attachment.url}` : f.attachment
    }));

DropZone.defaultDropOnEdit = (self, field) => (acceptedImgs, rejectedImgs) => {
  rejectedImgs.forEach(file =>
    toastr.error(`The file "${file.name}" hast not a valid extension or is larger than 1MB`)
  );

  acceptedImgs.forEach((file) => {
    toBase64(file, (parsedFile) => {
      let params = {
        name: file.name,
        attachment: parsedFile
      };

      if (self.state[field][0]) {
        params = {
          ...params,
          id: self.state[field][0].id
        };
      } else {
        params = {
          ...params,
          is_active: true
        };
      }

      self.setState({ [field]: [params] });
    });
  });
};

DropZone.defaultDropOnNew = (self, field, maxFilesAccepted = 1) => (acceptedImgs, rejectedImgs) => {
  rejectedImgs.forEach(file =>
    toastr.error(`The file "${file.name}" hast not a valid extension or is larger than 1MB`)
  );

  if (self.state[field].length >= maxFilesAccepted) {
    toastr.warning('Max number of files reached!');
    return;
  }

  const parsedFiles = [];
  acceptedImgs.forEach((file, i) => {
    toBase64(file, (parsedFile) => {
      parsedFiles.push({
        name: file.name,
        is_active: true,
        attachment: parsedFile
      });

      if (i === (acceptedImgs.length - 1)) {
        self.setState({
          [field]: [
            ...self.state[field],
            ...parsedFiles
          ]
        });
      }
    });
  });
};

DropZone.defaultDeleteOnEdit = (self, field) => () => {
  self.setState({
    [field]: [
      {
        id: self.state[field][0].id,
        _destroy: true
      }
    ]
  });
};

DropZone.defaultDeleteOnNew = (self, field) => (index) => {
  const attributes = self.state[field].slice();
  window.URL.revokeObjectURL(attributes[index].attachment);
  attributes.splice(index, 1);
  self.setState({ [field]: attributes });
};
