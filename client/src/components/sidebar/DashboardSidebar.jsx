import React from 'react';
import { LayoutDashboard, GraduationCap, Code, Compass, Star, Settings, ShieldQuestion } from 'lucide-react';
import { Sidebar } from './Sidebar.jsx';

export const DashboardSidebar = ({ user, onLogout, collapsed = false }) => {
  const groups = [
    {
      label: 'Menu',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Learning', path: '/learning', icon: GraduationCap },
        { label: 'Codex Workspace', path: '/codex', icon: Code },
        { label: 'Sandbox', path: '/sandbox', icon: Compass }
      ]
    },
    {
      label: 'Gamification',
      items: [
        { label: 'Achievements', path: '/achievements', icon: Star }
      ]
    },
    {
      label: 'Account',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Help Desk', path: '/help', icon: ShieldQuestion }
      ]
    }
  ];

  return <Sidebar user={user} onLogout={onLogout} groups={groups} collapsed={collapsed} />;
};
