import React from 'react';
import Nav from 'components/ui/Nav';

const links = [
  {
    text: 'Study case',
    href: '/study-cases'
  },
  {
    text: 'Business model element',
    href: '/business-model-element'
  },
  {
    text: 'Categories',
    href: '/category'
  },
  {
    text: 'Impact',
    href: '/impact'
  },
  {
    text: 'Enabling condition',
    href: '/enabling-condition'
  },
  {
    text: 'Cities',
    href: '/cities'
  },
  {
    text: 'Blogs',
    href: '/blogs'
  },
  {
    text: 'Events',
    href: '/events'
  },
  {
    text: 'City Supports',
    href: '/city-supports'
  }
];

export default function Sidebar() {
  return (
    <aside className="c-sidebar">
      <Nav links={links} />
    </aside>
  );
}
