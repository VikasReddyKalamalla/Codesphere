import React from 'react';
import { NavbarLogo } from './NavbarLogo.jsx';
import { NavbarSearch } from './NavbarSearch.jsx';
import { NavbarMenu } from './NavbarMenu.jsx';
import { NavbarProfile } from './NavbarProfile.jsx';
import { NavbarNotifications } from './NavbarNotifications.jsx';
import { NavbarTheme } from './NavbarTheme.jsx';
import { NavbarActions } from './NavbarActions.jsx';
import { MobileNavbar } from './MobileNavbar.jsx';

export const Navbar = ({
  user,
  isAuthenticated = false,
  onLogout,
  onLoginClick,
  menuItems = [
    { label: 'Courses', path: '/learning' },
    { label: 'Sandbox', path: '/sandbox' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' }
  ],
  notificationsCount = 0,
  notificationsItems = [],
  onMarkNotificationsRead
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7.5xl px-4 sm:px-6 lg:px-8 hidden lg:flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8 shrink-0">
          <NavbarLogo />
          <NavbarMenu items={menuItems} />
        </div>
        
        <div className="flex items-center gap-4 w-full justify-end">
          <NavbarSearch />
          <NavbarTheme />
          {isAuthenticated ? (
            <>
              <NavbarNotifications
                count={notificationsCount}
                items={notificationsItems}
                onMarkRead={onMarkNotificationsRead}
              />
              <NavbarProfile user={user} onLogout={onLogout} />
            </>
          ) : (
            <NavbarActions isAuthenticated={isAuthenticated} onLoginClick={onLoginClick} />
          )}
        </div>
      </div>
      <MobileNavbar menuItems={menuItems} />
    </header>
  );
};
