import React from 'react';
import { SecuritySettings } from '../components/SecuritySettings.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Security = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/settings" className="self-start" />
      <SecuritySettings />
    </div>
  );
};
