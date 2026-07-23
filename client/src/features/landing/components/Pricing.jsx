import React from 'react';
import { PricingCard } from '../../subscription/components/PricingCard.jsx';

export const Pricing = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 flex flex-col gap-6">
      <div className="text-center select-none">
        <h3 className="text-xl font-bold text-slate-850 dark:text-white">Straightforward Plans</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PricingCard plan={{ name: 'Developer monthly', price: 29, description: 'Unlimited compile workspaces minutes.' }} />
      </div>
    </div>
  );
};
