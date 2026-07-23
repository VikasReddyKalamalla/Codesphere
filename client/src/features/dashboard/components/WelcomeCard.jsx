import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';
import { Sparkles } from 'lucide-react';

export const WelcomeCard = ({ userName = 'Coder' }) => {
  return (
    <Card className="bg-gradient-to-r from-indigo-500 to-indigo-650 text-white border-0 shadow-lg">
      <CardBody className="flex items-center justify-between gap-4 p-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-bold text-lg select-none">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
            <span>Welcome back, {userName}!</span>
          </div>
          <p className="text-xs text-indigo-100 leading-relaxed max-w-sm">
            Let's compile code in the playpens, work in team sandboxes, or challenge yourself with live assessments today.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
