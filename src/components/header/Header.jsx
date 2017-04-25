import React from 'react';
import Nav from 'components/ui/Nav';
import { links } from 'constants/links';
import { Link } from 'react-router';
import { dispatch } from 'main';
import { logout } from 'modules/user';

export default function Header(props) {
  return (
    <header className="top-bar" role="banner">
      <div className="l-app-wrapper">
        <div className="top-bar-left">
          <Link to="/" className="logo">Sustainable Cities</Link>
        </div>
        <div className="top-bar-right">
          {props.user.logged ?
            <button className="button" type="button" onClick={() => { dispatch(logout()); }}>Logout</button> :
            <Nav links={links} />
          }
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  user: React.PropTypes.object
};
