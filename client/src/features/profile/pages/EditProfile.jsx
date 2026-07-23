import React from 'react';
import { EditProfileForm } from '../components/EditProfileForm.jsx';
import { AvatarUploader } from '../components/AvatarUploader.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const EditProfile = () => {
  return (
    <div className="max-w-lg mx-auto py-10 flex flex-col gap-5">
      <BackButton fallbackPath="/profile" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-5">
        <h3 className="text-sm font-bold text-slate-850 dark:text-white text-center">Edit Profile details</h3>
        <AvatarUploader />
        <EditProfileForm initialData={{ name: 'Vikas Reddy' }} />
      </div>
    </div>
  );
};
