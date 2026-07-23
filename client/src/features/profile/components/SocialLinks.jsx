import React from 'react';
import { Globe } from 'lucide-react';
import { FiGithub as Github } from 'react-icons/fi';

export const SocialLinks = ({ links = {} }) => {
  return (
    <div className="flex gap-3">
      {links.github && (
        <a href={links.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
          <Github className="w-5 h-5" />
        </a>
      )}
      {links.website && (
        <a href={links.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-650 transition-colors">
          <Globe className="w-5 h-5" />
        </a>
      )}
    </div>
  );
};
