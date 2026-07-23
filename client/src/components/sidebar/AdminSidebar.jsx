import React from 'react';
import { ShieldCheck, UserCog, UserCheck, ScrollText, AlertOctagon, Settings, HeartPulse, History, Speaker } from 'lucide-react';
import { Sidebar } from './Sidebar.jsx';

export const AdminSidebar = ({ user, onLogout, collapsed = false }) => {
  const groups = [
    {
      label: 'Control Room',
      items: [
        { label: 'Admin Dashboard', path: '/admin', icon: ShieldCheck },
        { label: 'Manage Users', path: '/admin/users', icon: UserCog },
        { label: 'Instructors Verification', path: '/admin/instructors', icon: UserCheck }
      ]
    },
    {
      label: 'Moderation & Reports',
      items: [
        { label: 'Flagged Content', path: '/admin/moderation', icon: AlertOctagon },
        { label: 'Content Audits', path: '/admin/reports', icon: ScrollText },
        { label: 'Broadcast Announcements', path: '/admin/announcements', icon: Speaker }
      ]
    },
    {
      label: 'System Maintenance',
      items: [
        { label: 'Audit Logs', path: '/admin/audit', icon: History },
        { label: 'Health Status', path: '/admin/health', icon: HeartPulse },
        { label: 'General Config', path: '/admin/settings', icon: Settings }
      ]
    }
  ];

  return <Sidebar user={user} onLogout={onLogout} groups={groups} collapsed={collapsed} />;
};
