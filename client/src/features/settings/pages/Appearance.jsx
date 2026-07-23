import React from 'react';
import { ThemeSettings } from '../components/ThemeSettings.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Appearance = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/settings" className="self-start" />
      <ThemeSettings />
    </div>
  );
};
