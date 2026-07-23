import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { Button } from '@components/common/Button.jsx';

export const HintBox = ({ hint = 'Check export key structures.' }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2 items-start select-none">
      <Button variant="ghost" size="sm" icon={Lightbulb} onClick={() => setShow(!show)}>
        {show ? 'Hide Hint' : 'Reveal Hint'}
      </Button>
      {show && (
        <p className="text-[10px] bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-200 dark:border-slate-805 text-slate-500 leading-relaxed font-medium">
          {hint}
        </p>
      )}
    </div>
  );
};
