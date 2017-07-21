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

DropZone.defaultFilesFromPhotos = self =>
  self.state.photos_attributes
    .filter(p => !p._destroy) // eslint-disable-line no-underscore-dangle
    .map(photo => ({
      id: photo.id,
      name: photo.name,
      attachment: photo.attachment.url ?
        `${config.API_URL}${photo.attachment.url}` : photo.attachment
    }));

DropZone.defaultPhotoDropOnEdit = self => (acceptedImgs, rejectedImgs) => {
  rejectedImgs.forEach(file =>
    toastr.error(`The image "${file.name}" hast not a valid extension or is larger than 1MB`)
  );

  acceptedImgs.forEach((file) => {
    toBase64(file, (parsedFile) => {
      // there is already a picture in the database
      const exists = !!self.state.photos_attributes[0];
      let photoParams = {
        name: file.name,
        attachment: parsedFile
      };

      if (exists) {
        photoParams = {
          ...photoParams,
          id: self.state.photos_attributes[0].id
        };
      } else {
        photoParams = {
          ...photoParams,
          is_active: true
        };
      }

      /* eslint-enable camelcase */
      self.setState({ photos_attributes: [photoParams] });
    });
  });
};

DropZone.defaultPhotoDeleteOnEdit = self => () => {
  self.setState({
    photos_attributes: [{
      id: self.state.photos_attributes[0].id,
      _destroy: true
    }]
  });
};

DropZone.defaultPhotoDropOnNew = (self, maxImagesAccepted) => (acceptedImgs, rejectedImgs) => {
  const parsedPhotos = [];

  rejectedImgs.forEach(file =>
    toastr.error(`The image "${file.name}" hast not a valid extension or is larger than 1MB`)
  );

  if (self.state.photos_attributes.length >= maxImagesAccepted) {
    toastr.warning('Max number of images reached!');
    return;
  }


  acceptedImgs.forEach((file, i) => {
    toBase64(file, (parsedFile) => {
      parsedPhotos.push({
        name: file.name,
        is_active: true,
        attachment: parsedFile
      });

      if (i === (acceptedImgs.length - 1)) {
        /* eslint-disable camelcase */
        let photos_attributes = self.state.photos_attributes.slice();
        photos_attributes = [...photos_attributes, ...parsedPhotos];
        /* eslint-enable camelcase */
        self.setState({ photos_attributes });
      }
    });
  });
};

DropZone.defaultPhotoDeleteOnNew = self => (index) => {
  // eslint-disable-next-line camelcase
  const photos_attributes = self.state.photos_attributes.slice();
  window.URL.revokeObjectURL(photos_attributes[index].attachment);
  photos_attributes.splice(index, 1);
  self.setState({ photos_attributes });
};
