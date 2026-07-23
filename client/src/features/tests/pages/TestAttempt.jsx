import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuestionCard } from '../components/QuestionCard.jsx';
import { Timer } from '../components/Timer.jsx';
import { TestProgress } from '../components/TestProgress.jsx';
import { Button } from '@components/common/Button.jsx';

export const TestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  const mockQuestions = [
    { text: 'Which hook should be used to memoize functions?', options: ['useCallback', 'useMemo', 'useEffect', 'useRef'] }
  ];

  const handleFinish = () => {
    navigate(`/tests/${testId}/results`);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-xl mx-auto py-8">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Interactive Assessment</span>
          <h4 className="text-xs font-semibold text-slate-800 dark:text-white mt-0.5">React Lifecycles</h4>
        </div>
        <Timer limit={1200} />
      </div>

      <TestProgress active={active + 1} total={mockQuestions.length} />
      <QuestionCard question={mockQuestions[active]} />

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="primary" onClick={handleFinish}>Finish Assessment</Button>
      </div>
    </div>
  );
};
