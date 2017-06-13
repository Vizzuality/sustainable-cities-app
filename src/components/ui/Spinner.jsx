import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Spinner({ isLoading, className, style }) {
  const cNames = classnames('c-spinner', {
    '-loading': isLoading,
    [className]: !!className
  });

  return (
    <div className={cNames}>
      <div className="spinner-box" style={style}>
        <div className="icon" />
      </div>
    </div>
  );
}

Spinner.propTypes = {
  isLoading: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string
};
