import React from 'react';
import { BillingHistory } from '../components/BillingHistory.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const PaymentHistory = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/subscription" className="self-start" />
      <BillingHistory list={[]} />
    </div>
  );
};
