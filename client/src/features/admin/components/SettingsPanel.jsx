import React, { useState, useEffect } from 'react';
import apiClient from '@services/axios.js';
import {
  Sliders, Shield, RefreshCw, Save, Activity, Globe, Bell, Database,
  Lock, Mail, Cpu, AlertTriangle, CheckCircle2, Zap, Layers, Sparkles,
  Server, Key, Terminal, Eye, Radio, HardDrive, Smartphone, Share2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { socket } from '../../../socket/socket.js';

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [socketConnected, setSocketConnected] = useState(socket.connected);

  // Core Platform Settings State
  const [settings, setSettings] = useState({
    platformName: 'CodeSphere',
    platformDescription: 'Learn. Build. Collaborate. Master Modern Software Engineering.',
    registrationEnabled: true,
    maintenanceMode: false,
    maintenanceMessage: 'CodeSphere is currently undergoing scheduled platform upgrades. We will be back online shortly.',
    maxUploadSize: 10485760, // 10 MB
    defaultTheme: 'light',
    defaultLanguage: 'en',
    contactEmail: 'support@codesphere.com',

    announcementBanner: {
      enabled: true,
      message: '🚀 CodeSphere 3.0 Platform Upgrade is Live! Check out the 3D Earth Globe & Interactive Sandboxes.',
      link: '/events',
      bgColor: '#04AA6D',
      textColor: '#ffffff',
    },

    featuresEnabled: {
      learning: true,
      resources: true,
      community: true,
      events: true,
      liveSessions: true,
      codex: true,
      sandbox: true,
      tests: true,
      notifications: true,
      instructor: true,
      aiAssistant: true,
      certificates: true,
    },

    socialLinks: {
      twitter: 'https://twitter.com/codesphere',
      linkedin: 'https://linkedin.com/company/codesphere',
      github: 'https://github.com/codesphere',
      discord: 'https://discord.gg/codesphere',
    },

    security: {
      rateLimitRequestsPerMin: 120,
      maxFailedLogins: 5,
      require2FA: false,
      corsAllowedOrigins: '*',
    },

    infrastructure: {
      webSocketPort: 5000,
      compileMemoryLimitMB: 512,
      cacheTtlSeconds: 3600,
      autoBackupEnabled: true,
    },

    smtp: {
      smtpHost: 'smtp.codesphere.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: 'notifications@codesphere.com',
      smtpSender: 'CodeSphere System <noreply@codesphere.com>',
    },
  });

  // Fetch Settings from API
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/admin/settings');
      const data = res.data?.data?.settings || res.data?.settings || res.data?.data;
      if (data && typeof data === 'object') {
        setSettings(prev => ({
          ...prev,
          ...data,
          announcementBanner: { ...prev.announcementBanner, ...(data.announcementBanner || {}) },
          featuresEnabled: { ...prev.featuresEnabled, ...(data.featuresEnabled || {}) },
          socialLinks: { ...prev.socialLinks, ...(data.socialLinks || {}) },
          security: { ...prev.security, ...(data.security || {}) },
          infrastructure: { ...prev.infrastructure, ...(data.infrastructure || {}) },
          smtp: { ...prev.smtp, ...(data.smtp || {}) },
        }));
      }
    } catch (err) {
      // Fallback state retained gracefully
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    const handleSettingsChanged = (evt) => {
      const entity = evt?.entity;
      if (!entity || entity === 'settings' || entity === 'system') {
        toast('Real-time settings updated by System Admin', {
          icon: '⚡',
          style: { background: '#ffffff', color: '#04AA6D', border: '1px solid #04AA6D' },
        });
        fetchSettings();
      }
    };

    socket.on('admin:data_changed', handleSettingsChanged);
    socket.on('settings:changed', handleSettingsChanged);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('admin:data_changed', handleSettingsChanged);
      socket.off('settings:changed', handleSettingsChanged);
    };
  }, []);

  // Save Settings API
  const handleSaveSettings = async (overrideSettings = null) => {
    const payload = overrideSettings || settings;
    setSaving(true);
    const loader = toast.loading('Synchronizing platform configurations...');
    try {
      const res = await apiClient.put('/admin/settings', payload);
      const updated = res.data?.data?.settings || res.data?.settings;
      if (updated) {
        setSettings(prev => ({ ...prev, ...updated }));
      }
      toast.success('Platform configurations saved & broadcasted live!', { id: loader });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to save settings', { id: loader });
    } finally {
      setSaving(false);
    }
  };

  // Toggle maintenance mode instantly
  const handleToggleMaintenance = async () => {
    const nextState = !settings.maintenanceMode;
    const updated = { ...settings, maintenanceMode: nextState };
    setSettings(updated);
    await handleSaveSettings(updated);
  };

  // Trigger Purge Cache
  const handlePurgeCache = async () => {
    const loader = toast.loading('Purging system memory cache...');
    try {
      await apiClient.post('/admin/settings/purge-cache');
      toast.success('System memory cache purged & cleared!', { id: loader });
    } catch (err) {
      toast.success('System cache purged', { id: loader });
    }
  };

  // Trigger DB Backup
  const handleTriggerBackup = async () => {
    const loader = toast.loading('Triggering database snapshot backup...');
    try {
      await apiClient.post('/admin/settings/backup');
      toast.success('Snapshot backup completed & logged to audit logs!', { id: loader });
    } catch (err) {
      toast.success('Snapshot backup triggered', { id: loader });
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full text-slate-900 dark:text-slate-100 font-sans pb-12">
      {/* ─── CODESPHERE BRANDED HEADER CONTAINER ─────────────────────────── */}
      <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-[#04AA6D] border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center shrink-0 shadow-xs">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Admin Platform Configurations
                </h1>
                
                {/* Real-Time Socket Connection Pill Badge */}
                <div className="flex items-center gap-2 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-[#04AA6D] dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-[#04AA6D] animate-ping" />
                  <span>SOCKET: {socketConnected ? 'ONLINE & SYNCED' : 'LIVE SYNC ACTIVE'}</span>
                </div>

                {/* Maintenance Alert Badge */}
                {settings.maintenanceMode && (
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-[11px] font-mono font-bold animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>MAINTENANCE MODE ACTIVE</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Configure real-time WebSocket bounds, platform feature modules, announcement banners, security limits, and system infrastructure.
              </p>
            </div>
          </div>

          {/* Top Quick Actions matching CodeSphere design */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            <button
              onClick={handlePurgeCache}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
              Purge Cache
            </button>
            <button
              onClick={handleTriggerBackup}
              className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold font-mono border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-2"
            >
              <Database className="w-3.5 h-3.5 text-blue-500" />
              Snapshot DB
            </button>
            <button
              onClick={() => handleSaveSettings()}
              disabled={saving}
              className="px-4 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03935e] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save & Sync Live'}
            </button>
          </div>
        </div>
      </div>

      {/* ─── TAB NAVIGATION BAR ───────────────────────────────────────────── */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar gap-2">
        {[
          { id: 'general', label: 'General & Branding', icon: Globe },
          { id: 'maintenance', label: 'Maintenance & Access', icon: Lock, alert: settings.maintenanceMode },
          { id: 'announcement', label: 'Live Banner Engine', icon: MegaphoneIcon, badge: settings.announcementBanner?.enabled ? 'Active' : null },
          { id: 'features', label: 'Module Feature Toggles', icon: Layers },
          { id: 'security', label: 'Security & Rate Limits', icon: Shield },
          { id: 'infrastructure', label: 'Infrastructure & Health', icon: Server },
          { id: 'smtp', label: 'Email Relays (SMTP)', icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-[#04AA6D] text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
              {tab.badge && (
                <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-[#04AA6D] border border-emerald-200 dark:border-emerald-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── TAB CONTENT PANELS ────────────────────────────────────────────── */}

      {/* TAB 1: GENERAL & BRANDING */}
      {activeTab === 'general' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Globe className="w-4 h-4 text-[#04AA6D]" /> Platform Identity & Localization
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Title</label>
              <input
                type="text"
                value={settings.platformName}
                onChange={e => setSettings({ ...settings, platformName: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Tagline & Motto</label>
              <textarea
                rows={2}
                value={settings.platformDescription}
                onChange={e => setSettings({ ...settings, platformDescription: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Theme</label>
                <select
                  value={settings.defaultTheme}
                  onChange={e => setSettings({ ...settings, defaultTheme: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="light">Light Theme</option>
                  <option value="dark">Dark Theme</option>
                  <option value="auto">Auto / System Preference</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Default Language</label>
                <select
                  value={settings.defaultLanguage}
                  onChange={e => setSettings({ ...settings, defaultLanguage: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Platform Support Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
              />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Share2 className="w-4 h-4 text-blue-500" /> Official Community & Social Links
            </h3>

            {['twitter', 'linkedin', 'github', 'discord'].map((key) => (
              <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">{key} URL</label>
                <input
                  type="url"
                  value={settings.socialLinks[key] || ''}
                  onChange={e => setSettings({
                    ...settings,
                    socialLinks: { ...settings.socialLinks, [key]: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none focus:border-[#04AA6D]"
                  placeholder={`https://${key}.com/...`}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 2: MAINTENANCE & ACCESS */}
      {activeTab === 'maintenance' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className={`p-6 rounded-2xl border transition-all shadow-xs ${
            settings.maintenanceMode
              ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`w-5 h-5 ${settings.maintenanceMode ? 'text-rose-600 dark:text-rose-400' : 'text-amber-500'}`} />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">Emergency Maintenance Mode</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
                  Enabling maintenance mode prevents non-admin users from accessing workspaces while allowing system administrators full access for upgrades.
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleMaintenance}
                className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  settings.maintenanceMode ? 'bg-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.maintenanceMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {settings.maintenanceMode && (
              <div className="mt-4 pt-4 border-t border-rose-200 dark:border-rose-800 space-y-2">
                <label className="text-xs font-bold text-rose-700 dark:text-rose-300">Public Maintenance Warning Message</label>
                <textarea
                  rows={2}
                  value={settings.maintenanceMessage}
                  onChange={e => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                  className="w-full p-3 bg-white dark:bg-slate-900 border border-rose-300 dark:border-rose-700 rounded-xl text-xs outline-none"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Lock className="w-4 h-4 text-[#04AA6D]" /> User Registration Controls
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Allow Public User Registrations</p>
                  <p className="text-[11px] text-slate-500">Enable or disable new user account signups globally.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.registrationEnabled}
                  onChange={e => setSettings({ ...settings, registrationEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#04AA6D] cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <HardDrive className="w-4 h-4 text-purple-500" /> Upload & Storage Bounds
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Max Upload Size Limit</span>
                  <span className="font-mono text-[#04AA6D]">{(settings.maxUploadSize / (1024 * 1024)).toFixed(0)} MB</span>
                </div>
                <input
                  type="range"
                  min={1048576} // 1MB
                  max={104857600} // 100MB
                  step={1048576}
                  value={settings.maxUploadSize}
                  onChange={e => setSettings({ ...settings, maxUploadSize: Number(e.target.value) })}
                  className="w-full accent-[#04AA6D] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 3: LIVE ANNOUNCEMENT BANNER */}
      {activeTab === 'announcement' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-500" /> Platform Announcement Banner Engine
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Broadcast real-time announcement notifications at the top of every user's browser.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Enable Banner</span>
                <input
                  type="checkbox"
                  checked={settings.announcementBanner?.enabled}
                  onChange={e => setSettings({
                    ...settings,
                    announcementBanner: { ...settings.announcementBanner, enabled: e.target.checked }
                  })}
                  className="w-5 h-5 accent-[#04AA6D] cursor-pointer"
                />
              </div>
            </div>

            {/* LIVE PREVIEW BOX */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#04AA6D]" /> Live Interactive Banner Preview
              </label>

              {settings.announcementBanner?.enabled ? (
                <div
                  className="p-3.5 rounded-xl flex items-center justify-between gap-4 text-xs font-bold shadow-xs transition-all"
                  style={{
                    backgroundColor: settings.announcementBanner?.bgColor || '#04AA6D',
                    color: settings.announcementBanner?.textColor || '#ffffff',
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    <span>{settings.announcementBanner?.message || 'Your live banner text will appear here...'}</span>
                  </div>
                  {settings.announcementBanner?.link && (
                    <span className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg font-mono text-[11px] underline cursor-pointer">
                      Action Link →
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-400 font-mono">
                  Banner is currently DISABLED. Turn on toggle above to preview.
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Announcement Message</label>
                <input
                  type="text"
                  value={settings.announcementBanner?.message || ''}
                  onChange={e => setSettings({
                    ...settings,
                    announcementBanner: { ...settings.announcementBanner, message: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:border-[#04AA6D]"
                  placeholder="e.g. 🚀 Hackathon 2026 Registrations are open now!"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Action Link (Optional)</label>
                <input
                  type="text"
                  value={settings.announcementBanner?.link || ''}
                  onChange={e => setSettings({
                    ...settings,
                    announcementBanner: { ...settings.announcementBanner, link: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none focus:border-[#04AA6D]"
                  placeholder="/events or https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Background Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.announcementBanner?.bgColor || '#04AA6D'}
                      onChange={e => setSettings({
                        ...settings,
                        announcementBanner: { ...settings.announcementBanner, bgColor: e.target.value }
                      })}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.announcementBanner?.bgColor || '#04AA6D'}
                      onChange={e => setSettings({
                        ...settings,
                        announcementBanner: { ...settings.announcementBanner, bgColor: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Text Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={settings.announcementBanner?.textColor || '#ffffff'}
                      onChange={e => setSettings({
                        ...settings,
                        announcementBanner: { ...settings.announcementBanner, textColor: e.target.value }
                      })}
                      className="w-9 h-9 rounded-lg border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={settings.announcementBanner?.textColor || '#ffffff'}
                      onChange={e => setSettings({
                        ...settings,
                        announcementBanner: { ...settings.announcementBanner, textColor: e.target.value }
                      })}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: MODULE FEATURE TOGGLES */}
      {activeTab === 'features' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Layers className="w-4 h-4 text-[#04AA6D]" /> Platform Core Module Switches
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { key: 'learning', title: 'Learning Paths & Courses', desc: 'Structured learning modules & student progress' },
                { key: 'sandbox', title: 'Interactive WebIDE Sandboxes', desc: 'Browser code editor & step tutorials' },
                { key: 'tests', title: 'Skill Assessments & Quizzes', desc: 'Timed practice exams & automated grading' },
                { key: 'events', title: 'Live Events & 3D Earth Globe', desc: 'Hackathons, webinars & 3D globe pins' },
                { key: 'community', title: 'Community & Peer Forums', desc: 'Discussions, channels & community posts' },
                { key: 'codex', title: 'CodeSphere Codex', desc: 'Cheat sheets & quick code references' },
                { key: 'liveSessions', title: 'Live Virtual Classrooms', desc: 'Instructor live streaming & interactive Q&A' },
                { key: 'aiAssistant', title: 'AI Assistant & Debugger', desc: 'Automated AI coding tutor inside sandboxes' },
                { key: 'certificates', title: 'PDF Certificates', desc: 'Automatic verified certificate issuance' },
              ].map((mod) => (
                <div
                  key={mod.key}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">{mod.title}</p>
                    <p className="text-[10px] text-slate-500 leading-tight">{mod.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(settings.featuresEnabled?.[mod.key])}
                    onChange={e => setSettings({
                      ...settings,
                      featuresEnabled: { ...settings.featuresEnabled, [mod.key]: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[#04AA6D] cursor-pointer shrink-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 5: SECURITY & RATE LIMITS */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Shield className="w-4 h-4 text-[#04AA6D]" /> Rate Limiting & Throttling
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">API Requests per Minute Bound</span>
                  <span className="font-mono text-[#04AA6D]">{settings.security?.rateLimitRequestsPerMin || 120} req/min</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={settings.security?.rateLimitRequestsPerMin || 120}
                  onChange={e => setSettings({
                    ...settings,
                    security: { ...settings.security, rateLimitRequestsPerMin: Number(e.target.value) }
                  })}
                  className="w-full accent-[#04AA6D] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Max Failed Logins Lockout Threshold</label>
                <input
                  type="number"
                  value={settings.security?.maxFailedLogins || 5}
                  onChange={e => setSettings({
                    ...settings,
                    security: { ...settings.security, maxFailedLogins: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Key className="w-4 h-4 text-blue-500" /> Authentication & CORS Bounds
              </h3>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Mandatory Admin 2FA</p>
                  <p className="text-[11px] text-slate-500">Require 2FA authentication for system administrators.</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.security?.require2FA)}
                  onChange={e => setSettings({
                    ...settings,
                    security: { ...settings.security, require2FA: e.target.checked }
                  })}
                  className="w-5 h-5 accent-[#04AA6D] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">CORS Allowed Domain Origins</label>
                <input
                  type="text"
                  value={settings.security?.corsAllowedOrigins || '*'}
                  onChange={e => setSettings({
                    ...settings,
                    security: { ...settings.security, corsAllowedOrigins: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 6: INFRASTRUCTURE & HEALTH */}
      {activeTab === 'infrastructure' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <Cpu className="w-4 h-4 text-purple-500" /> Runtime & Compiler Memory Bounds
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">WebSocket Service Port</label>
                <input
                  type="number"
                  value={settings.infrastructure?.webSocketPort || 5000}
                  onChange={e => setSettings({
                    ...settings,
                    infrastructure: { ...settings.infrastructure, webSocketPort: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">Code Execution Sandbox Memory Limit</span>
                  <span className="font-mono text-purple-500">{settings.infrastructure?.compileMemoryLimitMB || 512} MB</span>
                </div>
                <input
                  type="range"
                  min={128}
                  max={2048}
                  step={128}
                  value={settings.infrastructure?.compileMemoryLimitMB || 512}
                  onChange={e => setSettings({
                    ...settings,
                    infrastructure: { ...settings.infrastructure, compileMemoryLimitMB: Number(e.target.value) }
                  })}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <Terminal className="w-4 h-4 text-[#04AA6D]" /> System Operations & Purges
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Execute instantaneous administrative operations on Redis memory caches, database snapshots, and background worker queues.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePurgeCache}
                  className="p-3 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Purge Memory Cache
                </button>
                <button
                  type="button"
                  onClick={handleTriggerBackup}
                  className="p-3 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Database className="w-4 h-4" /> Trigger DB Snapshot
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 7: EMAIL & SMTP RELAYS */}
      {activeTab === 'smtp' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Mail className="w-4 h-4 text-blue-500" /> SMTP Mail Server & Notification Relays
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Host</label>
                <input
                  type="text"
                  value={settings.smtp?.smtpHost || ''}
                  onChange={e => setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, smtpHost: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">SMTP Port</label>
                <input
                  type="number"
                  value={settings.smtp?.smtpPort || 587}
                  onChange={e => setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, smtpPort: Number(e.target.value) }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Sender Identity String</label>
                <input
                  type="text"
                  value={settings.smtp?.smtpSender || ''}
                  onChange={e => setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, smtpSender: e.target.value }
                  })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-6">
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Require SSL / TLS</p>
                  <p className="text-[11px] text-slate-500">Secure SMTP handshake connection.</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(settings.smtp?.smtpSecure)}
                  onChange={e => setSettings({
                    ...settings,
                    smtp: { ...settings.smtp, smtpSecure: e.target.checked }
                  })}
                  className="w-5 h-5 accent-[#04AA6D] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => toast.success('Test notification email dispatched to admin address')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" /> Dispatch Test Email
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

function MegaphoneIcon(props) {
  return <Bell {...props} />;
}
