import React from 'react';
import { ProfileCertificates } from '../components/ProfileCertificates.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Certificates = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/profile" className="self-start" />
      <ProfileCertificates list={[{ title: 'Vite Certified Architect' }]} />
    </div>
  );
};
