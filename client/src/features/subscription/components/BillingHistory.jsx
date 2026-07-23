import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const BillingHistory = ({ list = [] }) => {
  return (
    <Card>
      <div className="px-4 py-3 border-b border-slate-205 dark:border-slate-805">
        <span className="text-xs font-bold text-slate-850 dark:text-white">Invoice Billing History</span>
      </div>
      <CardBody className="flex flex-col gap-3">
        {list.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-4">No billing logs records found.</p>
        ) : (
          list.map((inv, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs">
              <span>{inv.date} - Plan: {inv.plan}</span>
              <span className="font-bold text-slate-850 dark:text-white">${inv.amount}</span>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
};
