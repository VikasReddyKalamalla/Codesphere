import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Button } from '@components/common/Button.jsx';

export const PricingCard = ({ plan = {}, onSubscribe }) => {
  return (
    <Card className="flex flex-col border-2 border-indigo-100 hover:border-indigo-500 transition-all select-none">
      <CardBody className="flex flex-col gap-4 p-6 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[10px] font-bold text-indigo-505 uppercase tracking-widest">{plan.name}</span>
          <h3 className="text-2xl font-extrabold text-slate-805 dark:text-white mt-1">${plan.price} <span className="text-xs text-slate-400 font-medium">/ month</span></h3>
          <p className="text-xs text-slate-455 leading-relaxed mt-2">{plan.description}</p>
        </div>
        <Button variant="primary" onClick={onSubscribe} className="w-full mt-4">Choose plan</Button>
      </CardBody>
    </Card>
  );
};
