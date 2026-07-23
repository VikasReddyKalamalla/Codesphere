import React from 'react';
import { InvoiceCard } from '../components/InvoiceCard.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const Invoices = () => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <BackButton fallbackPath="/subscription" className="self-start" />
      <InvoiceCard invoice={{ id: 'INV-4423', amount: 29 }} />
    </div>
  );
};
