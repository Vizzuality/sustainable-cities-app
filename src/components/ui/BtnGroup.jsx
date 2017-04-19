import React from 'react';
import classnames from 'classnames';

export default function BtnGroup({ children, className }) {
  const cNames = classnames('c-btn-group', {
    [className]: !!className
  });

  return (
    <ul className={cNames}>
      {children.map((btn, i) => <li className="btn-group-item" key={i}>{btn}</li>)}
    </ul>
  );
}

BtnGroup.propTypes = {
  children: React.PropTypes.array,
  className: React.PropTypes.string
};
