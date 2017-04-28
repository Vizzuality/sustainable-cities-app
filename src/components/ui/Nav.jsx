import React from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

export default function Nav(props) {
  const cNames = classnames({ [props.className]: !!props.className });
  return (
    <nav className={cNames} role="navigation">
      <ul className="menu">
        {props.links.map((l, i) => {
          return (
            <li key={i}>
              <Link activeClassName="active" to={l.href}>{l.text}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

Nav.propTypes = {
  links: React.PropTypes.array,
  className: React.PropTypes.string
};
Nav.defaultProps = {
  links: []
};
