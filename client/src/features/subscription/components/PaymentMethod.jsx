import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { CreditCard } from 'lucide-react';

export const PaymentMethod = () => {
  return (
    <Card>
      <CardBody className="flex items-center gap-3 p-4">
        <CreditCard className="w-5 h-5 text-slate-400" />
        <div className="flex flex-col text-xs">
          <span className="font-bold text-slate-800 dark:text-white">Card Ending in 4242</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Expires 12/28</span>
        </div>
      </CardBody>
    </Card>
  );
};
