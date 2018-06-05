import React from 'react';
import PropTypes from 'prop-types';
import Nav from 'components/ui/Nav';
import { links } from 'constants/links';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { logout } from 'modules/user';

export default function Header(props) {
  return (
    <header className="c-header" role="banner">
      <Link to="/backoffice" className="logo">Sustainable Cities</Link>
      {props.user.logged ?
        <button className="button" type="button" onClick={() => { dispatch(logout()); }}>Logout</button> :
        <Nav links={links} />
      }
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.object
};
