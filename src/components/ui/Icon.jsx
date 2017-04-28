import React from 'react';
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
  name: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
};
