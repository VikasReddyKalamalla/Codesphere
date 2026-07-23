import React from 'react';
import { ProfileAchievements } from '../components/ProfileAchievements.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Achievements = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/profile" className="self-start" />
      <ProfileAchievements items={[]} />
    </div>
  );
};
