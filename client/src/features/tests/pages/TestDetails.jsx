import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@components/common/Button.jsx';
import { BackButton } from '@components/common/BackButton.jsx';

export const TestDetails = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto py-10 flex flex-col gap-6 animate-scale-in">
      <BackButton fallbackPath="/tests" className="self-start" />
      <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-xl p-8 shadow-sm flex flex-col gap-5 text-center">
        <div>
          <span className="text-[10px] font-bold text-indigo-505 uppercase">Assessment instructions</span>
          <h3 className="text-base font-bold text-slate-850 dark:text-white mt-1">React Hooks Verification</h3>
        </div>
        <p className="text-xs text-slate-450 leading-relaxed">
          Ensure you have a stable network interface before starting the test. Once started, the timer cannot be paused.
        </p>
        <Button variant="primary" className="w-full mt-2" onClick={() => navigate(`/tests/${testId}/attempt`)}>
          Start Assessment
        </Button>
      </div>
    </div>
  );
};
