import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * EmptyLayout — bare layout with no chrome.
 * Used for: full-screen modals, print views, embedded iframes.
 */
const EmptyLayout = () => (
  <div className="min-h-screen bg-slate-950">
    <Outlet />
  </div>
);

export default EmptyLayout;
