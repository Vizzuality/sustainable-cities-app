import React from 'react';
import PropTypes from 'prop-types';
import BtnGroup from 'components/ui/BtnGroup';
import { dispatch } from 'main';
import { toggleModal } from 'modules/modal';

export default function Confirm(props) {
  const onAccept = () => {
    if (props.onAccept) props.onAccept();
    dispatch(toggleModal(false));
  };

  const onCancel = () => {
    if (props.onCancel) props.onCancel();
    dispatch(toggleModal(false));
  };

  return (
    <div className="c-confirm">
      <p className="confirm-text">{props.text}</p>
      <BtnGroup>
        <button onClick={onAccept} className="button success">Yes</button>
        <button onClick={onCancel} className="button alert">Cancel</button>
      </BtnGroup>
    </div>
  );
}

Confirm.propTypes = {
  text: PropTypes.string,
  onAccept: PropTypes.func, // eslint-disable-line
  onCancel: PropTypes.func
};
