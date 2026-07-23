import React from 'react';
import { FiGithub as Github, FiTwitter as Twitter, FiLinkedin as Linkedin } from 'react-icons/fi';

export const FooterSocial = () => {
  const list = [
    { icon: Github, href: 'https://github.58' },
    { icon: Twitter, href: 'https://twitter.com' },
    { icon: Linkedin, href: 'https://linkedin.com' }
  ];

  return (
    <div className="flex gap-4">
      {list.map((item, idx) => {
        const Icon = item.icon;
        return (
          <a
            key={idx}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-450 hover:text-slate-700 hover:bg-slate-50 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <Icon className="w-4 h-4" />
          </a>
        );
      })}
    </div>
  );
};
