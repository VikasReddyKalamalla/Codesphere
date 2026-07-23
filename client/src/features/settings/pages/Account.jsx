import React from 'react';
import { AccountSettings } from '../components/AccountSettings.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Account = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/settings" className="self-start" />
      <AccountSettings />
    </div>
  );
};
