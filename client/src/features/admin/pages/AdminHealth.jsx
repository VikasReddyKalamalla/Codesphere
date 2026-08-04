import React from 'react';
import { HealthMonitor } from '../components/HealthMonitor.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export default function AdminHealthPage() {
  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      <BackButton fallbackPath="/admin" className="self-start" />
      <HealthMonitor />
    </div>
  );
}
