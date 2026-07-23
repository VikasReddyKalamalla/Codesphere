import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  User, Shield, Lock, Bell, Palette, Eye, Globe, GraduationCap,
  Code, Sparkles, Layout, Calendar, HardDrive, Download, Link2, Key,
  CreditCard, Sliders, Database, History, Activity, Slash, KeyRound,
  FlaskConical, Info, AlertTriangle, ShieldCheck, Monitor
} from 'lucide-react';
import { setActiveSection, selectActiveSection, selectSearchQuery } from '../redux';

export const settingTabs = [
  { id: 'account', label: 'Account', icon: User, category: 'General' },
  { id: 'profile', label: 'Profile', icon: User, category: 'General' },
  { id: 'security', label: 'Security', icon: Shield, category: 'Security' },
  { id: 'devices', label: 'Devices', icon: Monitor, category: 'Security' },
  { id: 'sessions', label: 'Active Sessions', icon: History, category: 'Security' },
  { id: 'privacy', label: 'Privacy', icon: Lock, category: 'Security' },
  { id: 'notifications', label: 'Notifications', icon: Bell, category: 'Preferences' },
  { id: 'appearance', label: 'Appearance', icon: Palette, category: 'Preferences' },
  { id: 'accessibility', label: 'Accessibility', icon: Eye, category: 'Preferences' },
  { id: 'language_region', label: 'Language & Region', icon: Globe, category: 'Preferences' },
  { id: 'learning', label: 'Learning Preferences', icon: GraduationCap, category: 'Workflows' },
  { id: 'coding', label: 'Coding Preferences', icon: Code, category: 'Workflows' },
  { id: 'ai', label: 'AI Preferences', icon: Sparkles, category: 'Workflows' },
  { id: 'dashboard', label: 'Dashboard Preferences', icon: Layout, category: 'Workflows' },
  { id: 'calendar', label: 'Calendar Settings', icon: Calendar, category: 'Workflows' },
  { id: 'storage', label: 'Storage', icon: HardDrive, category: 'System' },
  { id: 'downloads', label: 'Downloads', icon: Download, category: 'System' },
  { id: 'connected_accounts', label: 'Connected Accounts', icon: Link2, category: 'Integrations' },
  { id: 'api_keys', label: 'API Keys', icon: Key, category: 'Integrations' },
  { id: 'subscription', label: 'Subscription & Billing', icon: CreditCard, category: 'System' },
  { id: 'integrations', label: 'Integrations', icon: Sliders, category: 'Integrations' },
  { id: 'data_management', label: 'Export Data', icon: Database, category: 'System' },
  { id: 'backup_restore', label: 'Backup & Restore', icon: History, category: 'System' },
  { id: 'activity_logs', label: 'Activity Logs', icon: Activity, category: 'System' },
  { id: 'blocked_users', label: 'Blocked Users', icon: Slash, category: 'Security' },
  { id: 'permissions', label: 'Permissions', icon: KeyRound, category: 'Security' },
  { id: 'experimental', label: 'Experimental Features', icon: FlaskConical, category: 'System' },
  { id: 'about', label: 'About CodeSphere', icon: Info, category: 'System' },
  { id: 'danger_zone', label: 'Danger Zone', icon: AlertTriangle, category: 'Security' },
  { id: 'admin_instructor', label: 'Admin & Instructor Settings', icon: ShieldCheck, category: 'System' },
];

export const SettingsTabNav = () => {
  const dispatch = useDispatch();
  const activeSection = useSelector(selectActiveSection);
  const searchQuery = useSelector(selectSearchQuery).toLowerCase();

  const filteredTabs = settingTabs.filter(
    (t) => t.label.toLowerCase().includes(searchQuery) || t.id.toLowerCase().includes(searchQuery) || t.category.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 border-b border-slate-200 dark:border-slate-800/80 z-10">
      {filteredTabs.map((t) => {
        const Icon = t.icon;
        const isActive = activeSection === t.id;
        return (
          <button
            key={t.id}
            onClick={() => dispatch(setActiveSection(t.id))}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                : 'bg-slate-100 dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#04AA6D] dark:text-emerald-400'}`} />
            <span>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};
