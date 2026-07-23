import React from 'react';
import { NavbarLogo } from '../navbar/NavbarLogo.jsx';
import { FooterLinks } from './FooterLinks.jsx';
import { FooterSocial } from './FooterSocial.jsx';
import { FooterCopyright } from './FooterCopyright.jsx';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="mx-auto max-w-7.5xl px-4 py-12 sm:px-6 lg:px-8 flex flex-col gap-10">
        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex flex-col gap-4 max-w-xs">
            <NavbarLogo />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Premium sandbox, interactive Codex compilers, live webinars and code communities under one hub.
            </p>
            <FooterSocial />
          </div>
          <div className="lg:flex-1 lg:max-w-2xl">
            <FooterLinks />
          </div>
        </div>
        <FooterCopyright />
      </div>
    </footer>
  );
};
