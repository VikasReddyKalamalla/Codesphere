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
import { ShieldAlert, VideoOff, Maximize, AlertTriangle } from 'lucide-react';

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

  // Proctoring States
  const [warnings, setWarnings] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const videoRef = React.useRef(null);
  const MAX_WARNINGS = 3;

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

  // Fullscreen and Copy/Paste listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
      } else {
        setIsFullscreen(true);
      }
    };

    const preventCopyPaste = (e) => {
      e.preventDefault();
      toast.error('Copy/Paste is disabled during assessments.');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('contextmenu', preventCopyPaste);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('contextmenu', preventCopyPaste);
    };
  }, []);

  // Proctoring tab switch warning & auto-submit
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isFullscreen) {
        setWarnings(prev => {
          const newCount = prev + 1;
          if (newCount >= MAX_WARNINGS) {
            toast.error('Maximum violations reached. Auto-submitting assessment.', { duration: 5000 });
            handleFinish();
          } else {
            toast.error(`PROCTORING WARNING: Tab switching detected! (${newCount}/${MAX_WARNINGS} strikes)`, { duration: 4000 });
          }
          return newCount;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isFullscreen]);

  // Request Webcam
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setCameraStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Webcam access denied', err);
        toast.error('Webcam access is required for proctored assessments');
      }
    };
    startCamera();

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const requestFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch(err => toast.error('Failed to enter fullscreen'));
    }
  };

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

  if (!isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl max-w-md w-full text-center flex flex-col items-center gap-5 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">Proctored Assessment</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This assessment requires fullscreen mode. Leaving fullscreen or switching tabs will result in a violation strike. 
            </p>
          </div>
          <Button onClick={requestFullscreen} className="w-full flex justify-center items-center gap-2">
            <Maximize className="w-4 h-4" /> Enter Fullscreen to Start
          </Button>
        </div>
      </div>
    );
  }

  const currentQ = questions[active];
  const selectedAnswerText = answers[currentQ._id];
  const selectedOptionIndex = currentQ.options?.indexOf(selectedAnswerText);

  // Calculate solved questions count
  const solvedCount = Object.keys(answers).length;

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in max-w-xl mx-auto py-8 relative select-none">
      
      {/* Proctoring PIP */}
      <div className="fixed bottom-6 right-6 w-48 rounded-2xl overflow-hidden bg-slate-900 border-2 border-emerald-500 shadow-2xl z-40 hidden md:block group">
        <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-[9px] font-bold text-white tracking-widest uppercase">Recording</span>
        </div>
        {cameraStream ? (
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            muted 
            className="w-full aspect-video object-cover scale-x-[-1]" 
          />
        ) : (
          <div className="w-full aspect-video flex flex-col items-center justify-center bg-slate-900 text-slate-500">
            <VideoOff className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium">Camera Disabled</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 shrink-0">
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
          text: currentQ.questionTitle || currentQ.text,
          description: currentQ.questionDescription,
          type: currentQ.questionType || currentQ.type,
          options: currentQ.options,
          imageUrl: currentQ.imageUrl,
          codeSnippet: currentQ.codeSnippet,
          marks: currentQ.marks
        }}
        selectedOption={selectedOptionIndex !== -1 ? selectedOptionIndex : null}
        onSelectOption={handleSelectOption}
        textAnswer={selectedAnswerText}
        onChangeTextAnswer={(val) => setAnswers(prev => ({ ...prev, [currentQ._id]: val }))}
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
