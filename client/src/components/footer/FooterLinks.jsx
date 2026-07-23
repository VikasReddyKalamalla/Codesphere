import React from 'react';
import { Link } from 'react-router-dom';

export const FooterLinks = () => {
  const sections = [
    {
      title: 'Platform',
      links: [
        { label: 'Courses Catalog', path: '/learning' },
        { label: 'Live Classrooms', path: '/sessions' },
        { label: 'Playground Sandbox', path: '/sandbox' },
        { label: 'Pricing Plans', path: '/pricing' }
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Colleges Space', path: '/community' },
        { label: 'Code Jam Events', path: '/events' },
        { label: 'Partner Hub', path: '/about' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Contact Support', path: '/contact' },
        { label: 'Features Overview', path: '/features' }
      ]
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
      {sections.map((section, idx) => (
        <div key={idx} className="flex flex-col gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {section.title}
          </span>
          <div className="flex flex-col gap-2.5">
            {section.links.map((link, idy) => (
              <Link
                key={idy}
                to={link.path}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-650 dark:hover:text-indigo-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
