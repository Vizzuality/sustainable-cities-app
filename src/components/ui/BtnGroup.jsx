import React from 'react';
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
  children: React.PropTypes.array,
  className: React.PropTypes.string
};
