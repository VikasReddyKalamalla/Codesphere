import React from 'react';
import { Card } from '../common/Card.jsx';
import { CardBody } from '../common/CardBody.jsx';
import { Check } from 'lucide-react';
import { Button } from '../common/Button.jsx';
import clsx from 'clsx';

export const PricingCard = ({ tier = {}, onSelect }) => {
  return (
    <Card className={clsx('relative', tier.featured ? 'border-2 border-indigo-500 ring-4 ring-indigo-500/10' : '')}>
      {tier.featured && (
        <span className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-600 text-white shadow-sm">
          Most Popular
        </span>
      )}
      <CardBody className="flex flex-col gap-5 p-6">
        <div>
          <h4 className="text-base font-semibold text-slate-900 dark:text-white">{tier.name}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">{tier.description}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">${tier.price}</span>
          <span className="text-xs text-slate-400">/${tier.interval}</span>
        </div>
        <div className="flex flex-col gap-2">
          {tier.features && tier.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-350">
              <Check className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        <Button variant={tier.featured ? 'primary' : 'outline'} className="w-full mt-2" onClick={onSelect}>
          Choose {tier.name}
        </Button>
      </CardBody>
    </Card>
  );
};
