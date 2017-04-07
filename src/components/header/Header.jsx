import React from 'react';
import Nav from 'components/ui/Nav';
import { links } from 'constants/links';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { logout } from 'modules/user';

export default function Header(props) {
  return (
    <header className="c-header" role="banner">
      <div className="header-content l-app-wrapper">
        <Link to="/" className="logo">Sustainable Cities</Link>
        <div>
          <Nav links={links} />
          {props.user.logged &&
            <button type="button" onClick={() => { dispatch(logout()); }}>Logout</button>
          }
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: React.PropTypes.object
};
