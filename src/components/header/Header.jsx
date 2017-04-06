import React from 'react';
import Nav from 'components/ui/Nav';
import { links } from 'constants/links';
import { Link } from 'react-router';

export default function Header() {
  return (
    <header className="c-header" role="banner">
      <div className="header-content l-app-wrapper">
        <Link to="/" className="logo">Sustainable Cities</Link>
        <Nav links={links} />
      </div>
    </header>
  );
}
