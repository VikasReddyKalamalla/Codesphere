import React from 'react';
import { SettingsPanel } from '../components/SettingsPanel.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const PlatformSettings = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/admin" className="self-start" />
      <SettingsPanel />
    </div>
  );
};
