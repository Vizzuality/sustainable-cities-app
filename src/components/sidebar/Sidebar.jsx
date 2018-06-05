import React from 'react';
import Nav from 'components/ui/Nav';

const links = [
  {
    text: 'Study case',
    href: '/backoffice/study-cases'
  },
  {
    text: 'Business model element',
    href: '/backoffice/business-model-element'
  },
  {
    text: 'Categories',
    href: '/backoffice/category'
  },
  {
    text: 'Impact',
    href: '/backoffice/impact'
  },
  {
    text: 'Enabling condition',
    href: '/backoffice/enabling-condition'
  },
  {
    text: 'Cities',
    href: '/backoffice/cities'
  },
  {
    text: 'Blogs',
    href: '/backoffice/blogs'
  },
  {
    text: 'Events',
    href: '/backoffice/events'
  },
  {
    text: 'City Supports',
    href: '/backoffice/city-supports'
  }
];

export default function Sidebar() {
  return (
    <aside className="c-sidebar">
      <Nav links={links} />
    </aside>
  );
}
