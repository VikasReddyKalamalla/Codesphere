import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { QuestionCard } from '../components/QuestionCard.jsx';
import { Timer } from '../components/Timer.jsx';
import { TestProgress } from '../components/TestProgress.jsx';
import { Button } from '@components/common/Button.jsx';
import apiClient from '@services/axios.js';
import { setLastAttemptResult } from '../redux/testSlice.js';
import toast from 'react-hot-toast';

export const TestAttempt = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // maps questionId -> selectedAnswer string
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    const initAttempt = async () => {
      setLoading(true);
      try {
        // 1. Fetch test details
        const testRes = await apiClient.get(`/tests/${testId}`);
        const testData = testRes.data?.data || testRes.data || testRes;
        setTest(testData);

        // 2. Start/resume attempt
        const startRes = await apiClient.post(`/tests/${testId}/start`);
        const attemptData = startRes.data?.data || startRes.data || startRes;
        setAttempt(attemptData);

        // Populate existing answers if any
        if (attemptData.answers) {
          const loadedAnswers = {};
          attemptData.answers.forEach((ans) => {
            loadedAnswers[ans.questionId] = ans.selectedAnswer;
          });
          setAnswers(loadedAnswers);
        }

        // 3. Fetch test questions
        const questionsRes = await apiClient.get(`/tests/${testId}/questions`);
        const qData = questionsRes.data?.data || questionsRes.data || questionsRes;
        setQuestions(qData);
      } catch (err) {
        console.error('Failed to initialize test attempt:', err);
        toast.error(err.message || 'Failed to start assessment');
      } finally {
        setLoading(false);
      }
    };

    initAttempt();
  }, [testId]);

  // Proctoring tab switch warning
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.error('PROCTORING WARNING: Tab switching detected!', { duration: 4000 });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleSelectOption = async (optionIndex) => {
    if (!questions || questions.length === 0) return;
    const currentQ = questions[active];
    const optionText = currentQ.options[optionIndex];

    // Optimistically update locally
    setAnswers((prev) => ({ ...prev, [currentQ._id]: optionText }));

    try {
      // Save live to backend
      await apiClient.post(`/tests/${testId}/answer`, {
        questionId: currentQ._id,
        selectedAnswer: optionText
      });
    } catch (err) {
      console.error('Failed to save answer:', err);
      toast.error('Failed to auto-save answer');
    }
  };

  const handleFinish = async () => {
    try {
      toast.loading('Submitting assessment...', { id: 'submit-toast' });
      const submitRes = await apiClient.post(`/tests/${testId}/submit`);
      const result = submitRes.data?.data || submitRes.data || submitRes;
      dispatch(setLastAttemptResult(result));
      toast.success('Assessment submitted successfully!', { id: 'submit-toast' });
      navigate(`/tests/${testId}/results/${result._id || result.id}`);
    } catch (err) {
      console.error('Failed to submit test:', err);
      toast.error(err.message || 'Failed to submit test', { id: 'submit-toast' });
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">Loading Assessment...</div>;
  }

  if (!test || !questions || questions.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400 font-medium">
        Assessment could not be loaded or has no questions.
      </div>
    );
  }

  const currentQ = questions[active];
  const selectedAnswerText = answers[currentQ._id];
  const selectedOptionIndex = currentQ.options?.indexOf(selectedAnswerText);

  // Calculate solved questions count
  const solvedCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-xl mx-auto py-8">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3 shrink-0">
        <div>
          <span className="text-[10px] font-bold text-[#04AA6D] uppercase">Interactive Assessment</span>
          <h4 className="text-xs font-semibold text-slate-805 dark:text-white mt-0.5">{test.title}</h4>
        </div>
        <Timer limit={test.duration * 60} />
      </div>

      <TestProgress active={solvedCount} total={questions.length} />
      
      {/* Adapts Mongoose question schema to QuestionCard props */}
      <QuestionCard 
        question={{
          text: currentQ.questionTitle,
          options: currentQ.options
        }}
        selectedOption={selectedOptionIndex !== -1 ? selectedOptionIndex : null}
        onSelectOption={handleSelectOption}
      />

      <div className="flex justify-between items-center gap-3 mt-4">
        <Button 
          variant="secondary" 
          disabled={active === 0}
          onClick={() => setActive(prev => prev - 1)}
        >
          Previous
        </Button>
        {active < questions.length - 1 ? (
          <Button 
            variant="secondary" 
            onClick={() => setActive(prev => prev + 1)}
          >
            Next
          </Button>
        ) : (
          <Button variant="primary" onClick={handleFinish}>Finish Assessment</Button>
        )}
      </div>
    </div>
  );
};
