import React from 'react';
import { Card } from '@components/common/Card.jsx';
import { CardBody } from '@components/common/CardBody.jsx';

export const QuestionCard = ({ question = {}, selectedOption, onSelectOption }) => {
  return (
    <Card>
      <CardBody className="flex flex-col gap-4 select-none">
        <div>
          <span className="text-[10px] font-bold text-indigo-505 uppercase">Assessment Item</span>
          <h4 className="text-sm font-semibold text-slate-805 dark:text-white mt-1">{question.text}</h4>
        </div>
        <div className="flex flex-col gap-2.5">
          {(question.options || []).map((opt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectOption && onSelectOption(idx)}
              className={`w-full text-left px-4 py-2.5 text-xs rounded-lg border transition-all ${selectedOption === idx ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-bold' : 'border-slate-202 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-805 dark:text-slate-300'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
