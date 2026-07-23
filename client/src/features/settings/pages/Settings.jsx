import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsHeader } from '../components/SettingsHeader';
import { SettingsTabNav } from '../components/SettingsTabNav';

import { AccountSection } from '../components/AccountSection';
import { ProfileSection } from '../components/ProfileSection';
import { SecuritySection } from '../components/SecuritySection';
import { DeviceManagementSection } from '../components/DeviceManagementSection';
import { ActiveSessionsSection } from '../components/ActiveSessionsSection';
import { PrivacySection } from '../components/PrivacySection';
import { NotificationsSection } from '../components/NotificationsSection';
import { AppearanceSection } from '../components/AppearanceSection';
import { AccessibilitySection } from '../components/AccessibilitySection';
import { LanguageRegionSection } from '../components/LanguageRegionSection';
import { LearningPreferencesSection } from '../components/LearningPreferencesSection';
import { CodingPreferencesSection } from '../components/CodingPreferencesSection';
import { AIPreferencesSection } from '../components/AIPreferencesSection';
import { DashboardPreferencesSection } from '../components/DashboardPreferencesSection';
import { CalendarSettingsSection } from '../components/CalendarSettingsSection';
import { StorageSection } from '../components/StorageSection';
import { DownloadsSection } from '../components/DownloadsSection';
import { ConnectedAccountsSection } from '../components/ConnectedAccountsSection';
import { ApiKeysSection } from '../components/ApiKeysSection';
import { SubscriptionBillingSection } from '../components/SubscriptionBillingSection';
import { IntegrationsSection } from '../components/IntegrationsSection';
import { DataManagementSection } from '../components/DataManagementSection';
import { BackupRestoreSection } from '../components/BackupRestoreSection';
import { ActivityLogsSection } from '../components/ActivityLogsSection';
import { BlockedUsersSection } from '../components/BlockedUsersSection';
import { PermissionsSection } from '../components/PermissionsSection';
import { ExperimentalFeaturesSection } from '../components/ExperimentalFeaturesSection';
import { AboutSection } from '../components/AboutSection';
import { DangerZoneSection } from '../components/DangerZoneSection';
import { AdminInstructorSettingsSection } from '../components/AdminInstructorSettingsSection';

import { loadUserSettingsThunk, selectActiveSection } from '../redux';

export const Settings = () => {
  const dispatch = useDispatch();
  const activeSection = useSelector(selectActiveSection);

  useEffect(() => {
    dispatch(loadUserSettingsThunk());
  }, [dispatch]);

  const renderSectionView = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'devices':
        return <DeviceManagementSection />;
      case 'sessions':
        return <ActiveSessionsSection />;
      case 'privacy':
        return <PrivacySection />;
      case 'notifications':
        return <NotificationsSection />;
      case 'appearance':
        return <AppearanceSection />;
      case 'accessibility':
        return <AccessibilitySection />;
      case 'language_region':
        return <LanguageRegionSection />;
      case 'learning':
        return <LearningPreferencesSection />;
      case 'coding':
        return <CodingPreferencesSection />;
      case 'ai':
        return <AIPreferencesSection />;
      case 'dashboard':
        return <DashboardPreferencesSection />;
      case 'calendar':
        return <CalendarSettingsSection />;
      case 'storage':
        return <StorageSection />;
      case 'downloads':
        return <DownloadsSection />;
      case 'connected_accounts':
        return <ConnectedAccountsSection />;
      case 'api_keys':
        return <ApiKeysSection />;
      case 'subscription':
        return <SubscriptionBillingSection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'data_management':
        return <DataManagementSection />;
      case 'backup_restore':
        return <BackupRestoreSection />;
      case 'activity_logs':
        return <ActivityLogsSection />;
      case 'blocked_users':
        return <BlockedUsersSection />;
      case 'permissions':
        return <PermissionsSection />;
      case 'experimental':
        return <ExperimentalFeaturesSection />;
      case 'about':
        return <AboutSection />;
      case 'danger_zone':
        return <DangerZoneSection />;
      case 'admin_instructor':
        return <AdminInstructorSettingsSection />;

      case 'account':
      default:
        return <AccountSection />;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200 pb-16 animate-fade-in">
      {/* Background radial glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header */}
      <SettingsHeader />

      {/* Category Tab Navigation */}
      <SettingsTabNav />

      {/* Active Section Body */}
      <div className="z-10 w-full">
        {renderSectionView()}
      </div>
    </div>
  );
};
