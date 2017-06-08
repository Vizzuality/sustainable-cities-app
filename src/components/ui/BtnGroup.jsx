import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function BtnGroup({ children, className }) {
  const cNames = classnames('button-group', {
    [className]: !!className
  });

  return (
    <div className={cNames}>{children}</div>
  );
}

BtnGroup.propTypes = {
  children: PropTypes.array,
  className: PropTypes.string
};
