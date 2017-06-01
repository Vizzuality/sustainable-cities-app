import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classnames from 'classnames';

export default function Nav(props) {
  const cNames = classnames({ [props.className]: !!props.className });
  return (
    <nav className={cNames}>
      <ul className="menu">
        {props.links.map((l) => {
          return (
            <li key={l.href}>
              <Link activeClassName="active" to={l.href}>{l.text}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

Nav.propTypes = {
  links: PropTypes.array,
  className: PropTypes.string
};
Nav.defaultProps = {
  links: []
};
