import React from 'react';
import { NotificationSettings as SettingsForm } from '../components/NotificationSettings.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const NotificationSettingsPage = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/notifications" className="self-start" />
      <SettingsForm />
    </div>
  );
};
