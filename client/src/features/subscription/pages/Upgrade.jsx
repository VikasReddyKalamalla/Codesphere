import React from 'react';
import { PricingCard } from '../components/PricingCard.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Upgrade = () => {
  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      <BackButton fallbackPath="/subscription" className="self-start" />
      <div>
        <span className="text-[10px] font-bold text-indigo-505 uppercase">Licensing Upgrade</span>
        <h3 className="text-base font-bold text-slate-850 dark:text-white mt-0.5">Choose license tier</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PricingCard plan={{ name: 'Developer Plan', price: 29, description: 'Unlimited workspaces compile minutes.' }} />
      </div>
    </div>
  );
};
