import React from 'react';
import Nav from 'components/ui/Nav'

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
    text: 'Solution',
    href: '/solution'
  },
  {
    text: 'Source',
    href: '/source'
  },
  {
    text: 'Impact',
    href: '/impact'
  },
  {
    text: 'Enabling condition',
    href: '/enabling-condition'
  }
];

export default function Sidebar() {
  return (
    <aside className="c-sidebar">
      <Nav links={links} className="-stacked" />
    </aside>
  );
}
