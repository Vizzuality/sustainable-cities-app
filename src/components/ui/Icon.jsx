import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function SvgIcon({ name, className }) {
  const cNames = classnames('c-icon', {
    [className]: !!className
  });

  return (
    <svg className={cNames}>
      <use xlinkHref={`#${name}`} />
    </svg>
  );
}

SvgIcon.propTypes = {
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};
