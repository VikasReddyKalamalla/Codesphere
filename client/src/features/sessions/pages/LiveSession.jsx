import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Video, VideoOff, Mic, MicOff, Monitor, Hand, HelpCircle, Send, Users,
  Award, Pin, Plus, Trash, Download, FileCode, CheckCircle, Flame, Edit,
  Maximize2, Volume2, UserCheck, Play, Pause, X, Smile, ListCollapse
} from 'lucide-react';
import MonacoEditor from '@monaco-editor/react';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import { socket } from '../../../socket/socket.js';
import {
  getSessionByIdThunk,
  checkInThunk,
  checkOutThunk
} from '../redux/sessionThunk.js';
import {
  selectCurrentSession,
  selectSessionInteractivity,
  selectSessionQuestions,
  selectSessionPolls,
  selectSessionQuizzes,
  selectSessionResources,
  selectSessionRecordings,
  selectSessionAttendance
} from '../redux/sessionSelectors.js';
import {
  addQuestionLocally,
  updateQuestionLocally,
  addAnswerLocally,
  addPollLocally,
  updatePollLocally,
  addQuizLocally,
  updateQuizLocally,
  setInteractivityData
} from '../redux/sessionSlice.js';
import {
  askQuestionAPI,
  postAnswerAPI,
  voteQuestionAPI,
  pinQuestionAPI,
  markAnsweredAPI,
  createPollAPI,
  votePollAPI,
  closePollAPI,
  createQuizAPI,
  startQuizAPI,
  submitQuizAttemptAPI,
  getAttendanceAPI
} from '../services/sessionAPI.js';
import toast from 'react-hot-toast';

export const LiveSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector(selectCurrentUser);
  const session = useSelector(selectCurrentSession);
  const interactivity = useSelector(selectSessionInteractivity);
  const questions = useSelector(selectSessionQuestions);
  const polls = useSelector(selectSessionPolls);
  const quizzes = useSelector(selectSessionQuizzes);
  const resources = useSelector(selectSessionResources);
  const attendance = useSelector(selectSessionAttendance);

  const [activeCenterTab, setActiveCenterTab] = useState('stream'); // stream, code, whiteboard, notes
  const [activeRightTab, setActiveRightTab] = useState('chat'); // chat, qa, polls, participants

  const isHost = session?.host?._id === currentUser?._id;

  // ─── Real-Time Chat State ───────────────────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState({});

  // ─── Q&A panel state ────────────────────────────────────────────────────────
  const [qaInput, setQaInput] = useState('');
  const [qaAnswerInputs, setQaAnswerInputs] = useState({});

  // ─── Polls state ────────────────────────────────────────────────────────────
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isAnonymousPoll, setIsAnonymousPoll] = useState(false);

  // ─── Quiz state ─────────────────────────────────────────────────────────────
  const [quizTitle, setQuizTitle] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: '', options: ['', ''], correctOptionIndex: 0, durationSeconds: 30 }
  ]);
  const [quizAnswersSelection, setQuizAnswersSelection] = useState({});
  const [quizTimer, setQuizTimer] = useState(null);

  // ─── Whiteboard State ───────────────────────────────────────────────────────
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#8b5cf6');
  const [brushSize, setBrushSize] = useState(5);

  // ─── Monaco Code State ──────────────────────────────────────────────────────
  const [monacoCode, setMonacoCode] = useState('// Live Coding in Progress...');
  const [monacoLang, setMonacoLang] = useState('javascript');
  const isCodeWritable = isHost;

  // ─── Shared Notes State ─────────────────────────────────────────────────────
  const [sharedNotes, setSharedNotes] = useState('');

  // ─── WebRTC Media State ─────────────────────────────────────────────────────
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peerConnections = useRef({});

  // ─── Attendance analytics ──────────────────────────────────────────────────
  const [attendanceReport, setAttendanceReport] = useState(null);

  // ─── Hand Raise queue ───────────────────────────────────────────────────────
  const [handRaiseQueue, setHandRaiseQueue] = useState([]);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [allowedSpeakers, setAllowedSpeakers] = useState([]);

  // Setup Socket Connection
  useEffect(() => {
    dispatch(getSessionByIdThunk(sessionId));
    dispatch(checkInThunk(sessionId));

    // Connect socket
    socket.connect();
    socket.emit('session:join', { sessionId });

    // Listeners
    socket.on('session:joined', ({ tracking, history }) => {
      if (history) setChatMessages(history);
      if (tracking?.participants) {
        // Track speaking list, hand raise queue
      }
    });

    socket.on('session:participantJoined', ({ participant, participantCount }) => {
      toast.success(`${participant.user.fullName} joined class`);
    });

    socket.on('session:participantLeft', ({ userId, participantCount }) => {
      // Remove from list
    });

    socket.on('session:newMessage', ({ message }) => {
      setChatMessages((prev) => [...prev, message]);
    });

    socket.on('session:question:added', ({ question }) => {
      dispatch(addQuestionLocally(question));
    });

    socket.on('session:question:answered', ({ answer, questionId }) => {
      dispatch(addAnswerLocally({ questionId, answer }));
    });

    socket.on('session:question:voted', ({ question }) => {
      dispatch(updateQuestionLocally(question));
    });

    socket.on('session:question:pinned', ({ question }) => {
      dispatch(updateQuestionLocally(question));
    });

    socket.on('session:question:markedAnswered', ({ question }) => {
      dispatch(updateQuestionLocally(question));
    });

    socket.on('session:poll:created', ({ poll }) => {
      dispatch(addPollLocally(poll));
      toast.success('A new poll has been launched!');
      setActiveRightTab('polls');
    });

    socket.on('session:poll:voted', ({ poll }) => {
      dispatch(updatePollLocally(poll));
    });

    socket.on('session:poll:closed', ({ poll }) => {
      dispatch(updatePollLocally(poll));
      toast.error('The active poll has closed.');
    });

    socket.on('session:quiz:created', ({ quiz }) => {
      dispatch(addQuizLocally(quiz));
    });

    socket.on('session:quiz:started', ({ quiz }) => {
      dispatch(updateQuizLocally(quiz));
      toast.success('Live Quiz started! Answer quick!');
      setActiveRightTab('polls');
    });

    socket.on('session:quiz:submitted', ({ leaderboard }) => {
      // Update leaderboard list
    });

    socket.on('session:quiz:finished', ({ quizId, leaderboard }) => {
      toast.error('Quiz ended. Leaderboard finalized!');
    });

    socket.on('session:hand:raised', ({ user }) => {
      setHandRaiseQueue((prev) => {
        if (prev.some(u => u._id === user._id)) return prev;
        return [...prev, user];
      });
      if (isHost) toast(`${user.fullName} raised hand!`, { icon: '✋' });
    });

    socket.on('session:hand:lowered', ({ userId }) => {
      setHandRaiseQueue((prev) => prev.filter(u => u._id !== userId));
    });

    socket.on('session:hand:approved', ({ targetUserId }) => {
      setAllowedSpeakers((prev) => [...prev, targetUserId]);
      if (targetUserId === currentUser?._id) {
        toast.success('Instructor approved you to speak! Toggle mic to talk.');
      }
    });

    socket.on('session:code:synced', ({ code, language }) => {
      setMonacoCode(code);
      setMonacoLang(language);
    });

    socket.on('session:whiteboard:drawn', ({ drawAction }) => {
      drawOnCanvasLocally(drawAction);
    });

    socket.on('session:notes:synced', ({ notes }) => {
      setSharedNotes(notes);
    });

    socket.on('session:signal', async ({ fromUserId, signalData }) => {
      // Handle WebRTC signal relay
      const pc = peerConnections.current[fromUserId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(signalData));
      }
    });

    // Load attendance metrics if host
    if (isHost) {
      loadAttendanceAnalytics();
    }

    return () => {
      socket.emit('session:leave', { sessionId });
      socket.disconnect();
    };
  }, [sessionId, dispatch, isHost]);

  // Load local media streams for WebRTC
  useEffect(() => {
    if (activeCenterTab === 'stream') {
      setupLocalStream();
    }
  }, [activeCenterTab]);

  const setupLocalStream = async () => {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Media devices access failed, falling back to mock stream', err);
    }
  };

  const loadAttendanceAnalytics = async () => {
    try {
      const data = await getAttendanceAPI(sessionId);
      setAttendanceReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ─── WebRTC Toggles ────────────────────────────────────────────────────────
  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => track.enabled = isMuted);
    }
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach(track => track.enabled = isVideoOff);
    }
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        setupLocalStream();
        setIsScreenSharing(false);
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsScreenSharing(true);
      }
    } catch (err) {
      toast.error('Screen sharing canceled or failed');
    }
  };

  // ─── Real-Time Chat handlers ───────────────────────────────────────────────
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!currentMessage.trim()) return;
    socket.emit('session:message', { sessionId, content: currentMessage.trim() });
    setCurrentMessage('');
  };

  // ─── Q&A Handlers ──────────────────────────────────────────────────────────
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!qaInput.trim()) return;
    try {
      const q = await askQuestionAPI(sessionId, qaInput.trim());
      socket.emit('session:question:add', { sessionId, question: q });
      setQaInput('');
      toast.success('Question added to Q&A Panel!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVoteQuestion = async (qId) => {
    try {
      const q = await voteQuestionAPI(sessionId, qId);
      socket.emit('session:question:vote', { sessionId, question: q });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePinQuestion = async (qId) => {
    try {
      const q = await pinQuestionAPI(sessionId, qId);
      socket.emit('session:question:pin', { sessionId, question: q });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkAnswered = async (qId) => {
    try {
      const q = await markAnsweredAPI(sessionId, qId);
      socket.emit('session:question:markAnswered', { sessionId, question: q });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleAnswerQuestion = async (e, qId) => {
    e.preventDefault();
    const ansText = qaAnswerInputs[qId];
    if (!ansText?.trim()) return;
    try {
      const ans = await postAnswerAPI(sessionId, qId, ansText.trim());
      socket.emit('session:question:answer', { sessionId, answer: ans, questionId: qId });
      setQaAnswerInputs(prev => ({ ...prev, [qId]: '' }));
      toast.success('Response posted.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ─── Polls Handlers ─────────────────────────────────────────────────────────
  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const p = await createPollAPI(sessionId, {
        question: pollQuestion.trim(),
        options: pollOptions.filter(Boolean),
        isAnonymous: isAnonymousPoll
      });
      socket.emit('session:poll:create', { sessionId, poll: p });
      setPollQuestion('');
      setPollOptions(['', '']);
      toast.success('Poll launched!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVotePoll = async (pId, idx) => {
    try {
      const p = await votePollAPI(sessionId, pId, idx);
      socket.emit('session:poll:vote', { sessionId, poll: p });
      toast.success('Vote recorded!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClosePoll = async (pId) => {
    try {
      const p = await closePollAPI(sessionId, pId);
      socket.emit('session:poll:close', { sessionId, poll: p });
    } catch (err) {
      toast.error(err.message);
    }
  };

  // ─── Quizzes Handlers ───────────────────────────────────────────────────────
  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    try {
      const qz = await createQuizAPI(sessionId, {
        title: quizTitle.trim(),
        questions: quizQuestions
      });
      socket.emit('session:quiz:create', { sessionId, quiz: qz });
      setQuizTitle('');
      toast.success('Quiz generated! You can start it anytime.');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleStartQuiz = async (qzId) => {
    try {
      const qz = await startQuizAPI(sessionId, qzId);
      socket.emit('session:quiz:start', { sessionId, quiz: qz });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitQuizAnswers = async (qzId) => {
    const answersList = Object.keys(quizAnswersSelection).map((qIdx) => ({
      questionIndex: Number(qIdx),
      selectedOptionIndex: quizAnswersSelection[qIdx]
    }));
    try {
      await submitQuizAttemptAPI(sessionId, qzId, answersList);
      toast.success('Quiz answers submitted successfully!');
    } catch (err) {
      toast.error(err.message || 'Submission failed');
    }
  };

  // ─── Hand Raise handlers ───────────────────────────────────────────────────
  const raiseHand = () => {
    socket.emit('session:hand:raise', { sessionId });
    setIsHandRaised(true);
  };

  const lowerHand = () => {
    socket.emit('session:hand:lower', { sessionId });
    setIsHandRaised(false);
  };

  const approveSpeaker = (targetUserId) => {
    socket.emit('session:hand:approve', { sessionId, targetUserId });
  };

  // ─── Monaco Sync handlers ──────────────────────────────────────────────────
  const handleCodeChange = (val) => {
    setMonacoCode(val);
    socket.emit('session:code:sync', { sessionId, code: val, language: monacoLang });
  };

  const handleLangChange = (e) => {
    setMonacoLang(e.target.value);
    socket.emit('session:code:sync', { sessionId, code: monacoCode, language: e.target.value });
  };

  // ─── Whiteboard handlers ───────────────────────────────────────────────────
  useEffect(() => {
    if (activeCenterTab === 'whiteboard') {
      const canvas = canvasRef.current;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = 450;
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.strokeStyle = brushColor;
      context.lineWidth = brushSize;
      contextRef.current = context;
    }
  }, [activeCenterTab]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();

    // Sync drawing action
    socket.emit('session:whiteboard:draw', {
      sessionId,
      drawAction: {
        x: offsetX,
        y: offsetY,
        color: brushColor,
        size: brushSize,
        type: 'draw'
      }
    });
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const drawOnCanvasLocally = (drawAction) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.strokeStyle = drawAction.color;
    context.lineWidth = drawAction.size;
    context.lineTo(drawAction.x, drawAction.y);
    context.stroke();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('session:whiteboard:draw', { sessionId, drawAction: { type: 'clear' } });
  };

  return (
    <div className="flex flex-col gap-4 w-full h-[90vh] text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-4 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <div className="flex justify-between items-center bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 p-3 rounded-2xl backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-[10px] font-black animate-pulse uppercase tracking-wider font-mono">
            ● LIVE
          </div>
          <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate max-w-md">{session?.title}</h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Check In Indicator */}
          <span className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
            <UserCheck className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
            Check-In: Attending
          </span>

          <button
            onClick={() => {
              dispatch(checkOutThunk(sessionId));
              navigate('/sessions');
            }}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 font-bold text-xs rounded-xl transition-all shadow-md uppercase tracking-wider text-white cursor-pointer"
          >
            Leave Webcast
          </button>
        </div>
      </div>

      {/* Main Split viewport */}
      <div className="flex-1 flex gap-4 min-h-0 z-10">
        
        {/* Left Side: Media grid / Coding space / Whiteboard */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          
          {/* Sub Navigation controls */}
          <div className="flex gap-1.5 bg-slate-100/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 p-1 rounded-xl self-start">
            {[
              { id: 'stream', label: 'Audio/Video Feed', icon: Video },
              { id: 'code', label: 'Monaco Code Sync', icon: FileCode },
              { id: 'whiteboard', label: 'Canvas Board', icon: Edit }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCenterTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer ${
                  activeCenterTab === tab.id
                    ? 'bg-emerald-500/20 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Container */}
          <div className="flex-1 bg-slate-50 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-2xl relative overflow-hidden flex flex-col justify-center min-h-[300px]">
            
            {/* 1. Video WebRTC streaming viewport */}
            {activeCenterTab === 'stream' && (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                
                {/* Local Video Card */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                      <VideoOff className="w-10 h-10" />
                      <span className="text-xs">Camera Feed Disabled</span>
                    </div>
                  ) : (
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                  )}
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-slate-300">
                    {currentUser?.fullName} (You)
                  </span>
                </div>

                {/* Remote Video Spotlight */}
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-slate-500 p-6 text-center">
                    <Sparkles className="w-10 h-10 text-[#04AA6D] dark:text-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-400 mt-1">Spotlight Video Stream</span>
                    <span className="text-[10px] text-slate-600 max-w-xs leading-relaxed">Instructor feed active. Signal relayed through ICE tunnels.</span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold text-slate-300">
                    Webcast Stream Spot
                  </span>
                </div>
              </div>
            )}

            {/* 2. Monaco Editor Viewport */}
            {activeCenterTab === 'code' && (
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-900">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-[#04AA6D] dark:text-emerald-400 tracking-wider font-mono">COLLABORATIVE WORKSPACE</span>
                    <select
                      value={monacoLang}
                      onChange={handleLangChange}
                      disabled={!isHost}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-1 text-[10px] text-slate-700 dark:text-slate-400 focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="python">Python</option>
                    </select>
                  </div>
                  <span className="text-[9px] text-slate-500 font-mono">
                    {isHost ? '✎ Write Mode Enabled' : '🔒 Read-only Synced'}
                  </span>
                </div>
                <div className="flex-1 relative">
                  <MonacoEditor
                    height="100%"
                    language={monacoLang}
                    theme="vs-dark"
                    value={monacoCode}
                    onChange={handleCodeChange}
                    options={{
                      readOnly: !isCodeWritable,
                      minimap: { enabled: false },
                      fontSize: 12
                    }}
                  />
                </div>
              </div>
            )}

            {/* 3. Whiteboard Viewport */}
            {activeCenterTab === 'whiteboard' && (
              <div className="w-full h-full flex flex-col bg-slate-950">
                <div className="flex justify-between items-center bg-slate-950 px-4 py-2 border-b border-slate-900">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={brushColor}
                      onChange={(e) => setBrushColor(e.target.value)}
                      className="w-5 h-5 bg-transparent border-0 cursor-pointer rounded-full"
                    />
                    <input
                      type="range"
                      min="1"
                      max="15"
                      value={brushSize}
                      onChange={(e) => setBrushSize(Number(e.target.value))}
                      className="w-20 cursor-pointer"
                    />
                  </div>

                  {isHost && (
                    <button
                      onClick={clearCanvas}
                      className="px-3 py-1 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 rounded font-bold text-[9px] text-rose-400 uppercase tracking-widest cursor-pointer"
                    >
                      Clear Board
                    </button>
                  )}
                </div>
                <div className="flex-1 relative overflow-hidden bg-slate-950 cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="absolute inset-0"
                  />
                </div>
              </div>
            )}

          </div>

          {/* Classroom toolbar */}
          <div className="flex justify-between items-center bg-slate-100/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-900 p-3 rounded-2xl shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isMuted
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleVideo}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isVideoOff
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  isScreenSharing
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-[#04AA6D] dark:text-emerald-400'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Student Raise Hand control */}
              {!isHost && (
                isHandRaised ? (
                  <button
                    onClick={lowerHand}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md uppercase tracking-wider cursor-pointer"
                  >
                    <Hand className="w-4 h-4" />
                    Lower Hand
                  </button>
                ) : (
                  <button
                    onClick={raiseHand}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 transition-all uppercase tracking-wider cursor-pointer"
                  >
                    <Hand className="w-4 h-4" />
                    Raise Hand
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Chat / Q&A / Polls / Users */}
        <div className="w-80 flex flex-col gap-3 bg-slate-50/80 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 rounded-3xl p-4 shrink-0 min-h-0">
          
          {/* Tab selector buttons */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-900 pb-2">
            {[
              { id: 'chat', label: 'Chat', icon: Send },
              { id: 'qa', label: 'Q&A', icon: HelpCircle },
              { id: 'polls', label: 'Polls', icon: Award },
              { id: 'participants', label: 'Users', icon: Users }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveRightTab(tab.id)}
                className={`p-1.5 rounded-lg transition-colors relative cursor-pointer ${
                  activeRightTab === tab.id ? 'text-[#04AA6D] dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title={tab.label}
              >
                <tab.icon className="w-4.5 h-4.5" />
                {activeRightTab === tab.id && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#04AA6D] dark:bg-emerald-400" />
                )}
              </button>
            ))}
          </div>

          {/* Tab content area */}
          <div className="flex-1 overflow-y-auto no-scrollbar min-h-0">
            
            {/* 1. Real-Time Chat messages panel */}
            {activeRightTab === 'chat' && (
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-3 pr-1 py-1">
                  {chatMessages.map((msg) => (
                    <div key={msg._id} className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#04AA6D] dark:text-emerald-400">{msg.sender?.fullName}</span>
                        <span className="text-[8px] text-slate-500 font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-900 px-3 py-2 rounded-2xl text-[11px] text-slate-800 dark:text-slate-300 leading-relaxed font-sans max-w-[90%] self-start break-words shadow-sm">
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendChatMessage} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-900 mt-2">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. Questions Panel (Q&A) */}
            {activeRightTab === 'qa' && (
              <div className="h-full flex flex-col justify-between">
                <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 py-1 pr-1">
                  {questions.map((q) => (
                    <div key={q._id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-3 rounded-2xl flex flex-col gap-2 relative shadow-sm">
                      {q.isPinned && (
                        <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-widest font-mono">
                          <Pin className="w-2.5 h-2.5 fill-amber-400" />
                          PINNED
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-800 dark:text-slate-300">{q.userId?.fullName}</span>
                      </div>
                      <p className="text-[11px] text-slate-800 dark:text-slate-200 leading-normal">{q.questionText}</p>

                      <div className="flex items-center gap-3 mt-1.5 text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                        <button onClick={() => handleVoteQuestion(q._id)} className="hover:text-[#04AA6D] dark:hover:text-emerald-400 flex items-center gap-1 cursor-pointer">
                          ▲ {q.votes?.length || 0} Votes
                        </button>
                        <span>{q.isAnswered ? '✓ Answered' : '✗ Unanswered'}</span>
                      </div>

                      {/* Display replies */}
                      {q.answers?.map((ans) => (
                        <div key={ans._id} className="mt-2 pl-3 border-l-2 border-emerald-500/40 flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold text-[#04AA6D] dark:text-emerald-400">{ans.userId?.fullName}</span>
                          <p className="text-[10px] text-slate-700 dark:text-slate-300 leading-tight">{ans.answerText}</p>
                        </div>
                      ))}

                      {/* Post answer text area */}
                      <form onSubmit={(e) => handleAnswerQuestion(e, q._id)} className="mt-2 flex gap-1.5">
                        <input
                          type="text"
                          placeholder="Type answer..."
                          value={qaAnswerInputs[q._id] || ''}
                          onChange={(e) => setQaAnswerInputs(prev => ({ ...prev, [q._id]: e.target.value }))}
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none"
                        />
                        <button type="submit" className="p-1 bg-[#04AA6D] hover:bg-[#03935e] rounded-lg text-white cursor-pointer">
                          &gt;
                        </button>
                      </form>

                      {isHost && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-950/40">
                          <button onClick={() => handlePinQuestion(q._id)} className="text-[9px] uppercase font-bold text-amber-600 dark:text-amber-500 hover:underline font-mono cursor-pointer">
                            {q.isPinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button onClick={() => handleMarkAnswered(q._id)} className="text-[9px] uppercase font-bold text-[#04AA6D] dark:text-emerald-500 hover:underline font-mono cursor-pointer">
                            Toggle Answered
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskQuestion} className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-900 mt-2">
                  <input
                    type="text"
                    placeholder="Ask class a question..."
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    className="flex-1 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                  />
                  <button type="submit" className="p-2 bg-[#04AA6D] hover:bg-[#03935e] text-white rounded-xl shadow-md cursor-pointer">
                    Ask
                  </button>
                </form>
              </div>
            )}

            {/* 3. Polls/Quizzes Panel */}
            {activeRightTab === 'polls' && (
              <div className="h-full flex flex-col gap-6">
                
                {/* Active Polls section */}
                <div className="flex flex-col gap-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Live Polls</span>
                  {polls.map((p) => {
                    const totalVotes = p.votes?.length || 0;
                    return (
                      <div key={p._id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-3 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                        <h4 className="font-bold text-[11px] text-slate-800 dark:text-slate-200">{p.question}</h4>
                        <div className="flex flex-col gap-1.5">
                          {p.options.map((opt, oIdx) => {
                            const optionVotes = p.votes?.filter((v) => v.optionIndex === oIdx).length || 0;
                            const pct = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                            return (
                              <button
                                key={opt}
                                onClick={() => handleVotePoll(p._id, oIdx)}
                                disabled={p.isClosed}
                                className="relative overflow-hidden w-full text-left px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/20 text-[10px] font-bold text-slate-700 dark:text-slate-300 transition-all bg-slate-50 dark:bg-slate-950/20 cursor-pointer"
                              >
                                <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/10 pointer-events-none transition-all" style={{ width: `${pct}%` }} />
                                <div className="flex justify-between items-center relative z-10">
                                  <span>{opt}</span>
                                  <span className="font-mono text-[#04AA6D] dark:text-emerald-400">{pct}% ({optionVotes})</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        {isHost && !p.isClosed && (
                          <button
                            onClick={() => handleClosePoll(p._id)}
                            className="mt-1 py-1 rounded bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-[9px] uppercase tracking-widest cursor-pointer"
                          >
                            Close Poll
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {isHost && (
                    <form onSubmit={handleCreatePoll} className="flex flex-col gap-2.5 mt-2 border-t border-slate-200 dark:border-slate-900 pt-3">
                      <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Create Poll</span>
                      <input
                        type="text"
                        placeholder="Poll Question"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none placeholder-slate-400 dark:placeholder-slate-500"
                      />
                      <input
                        type="text"
                        placeholder="Option 1"
                        value={pollOptions[0]}
                        onChange={(e) => setPollOptions(prev => [e.target.value, prev[1]])}
                        className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Option 2"
                        value={pollOptions[1]}
                        onChange={(e) => setPollOptions(prev => [prev[0], e.target.value])}
                        className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-800 dark:text-slate-200 focus:outline-none"
                      />
                      <button type="submit" className="py-1.5 bg-[#04AA6D] hover:bg-[#03935e] text-white text-[10px] font-bold rounded-xl transition-all shadow-md cursor-pointer">
                        Launch Poll
                      </button>
                    </form>
                  )}
                </div>

                {/* Quizzes Section */}
                <div className="flex flex-col gap-4 border-t border-slate-200 dark:border-slate-900 pt-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Live Quizzes</span>
                  {quizzes.map((qz) => (
                    <div key={qz._id} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-900 p-3 rounded-2xl flex flex-col gap-2.5 shadow-sm">
                      <h4 className="font-bold text-[11px] text-slate-800 dark:text-slate-200">{qz.title}</h4>
                      
                      {qz.status === 'active' && (
                        <div className="flex flex-col gap-2">
                          {qz.questions.map((question, qIdx) => (
                            <div key={question.questionText} className="flex flex-col gap-1.5">
                              <span className="text-[10px] text-slate-700 dark:text-slate-300">{question.questionText}</span>
                              <div className="flex flex-col gap-1">
                                {question.options.map((opt, oIdx) => (
                                  <button
                                    key={opt}
                                    onClick={() => setQuizAnswersSelection(prev => ({ ...prev, [qIdx]: oIdx }))}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg border text-[9px] font-bold transition-all cursor-pointer ${
                                      quizAnswersSelection[qIdx] === oIdx
                                        ? 'bg-emerald-500/20 border-emerald-500 text-[#04AA6D] dark:text-emerald-400'
                                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => handleSubmitQuizAnswers(qz._id)}
                            className="w-full py-1.5 bg-[#04AA6D] hover:bg-[#03935e] text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                          >
                            Submit Answers
                          </button>
                        </div>
                      )}

                      {qz.status === 'draft' && isHost && (
                        <button
                          onClick={() => handleStartQuiz(qz._id)}
                          className="w-full py-1.5 bg-[#04AA6D] hover:bg-[#03935e] text-white font-bold text-[10px] rounded-xl transition-all cursor-pointer"
                        >
                          Start Live Quiz
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Hand raise queue & Active participants */}
            {activeRightTab === 'participants' && (
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Hand Raise Queue</span>
                <div className="flex flex-col gap-2">
                  {handRaiseQueue.length > 0 ? (
                    handRaiseQueue.map((user) => (
                      <div key={user._id} className="flex justify-between items-center bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-900 p-2.5 rounded-xl shadow-sm">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.fullName}</span>
                        {isHost && (
                          <button
                            onClick={() => approveSpeaker(user._id)}
                            className="px-2.5 py-1 bg-[#04AA6D] hover:bg-[#03935e] text-white font-bold text-[9px] rounded-lg transition-all cursor-pointer"
                          >
                            Approve Mic
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="text-[10px] text-slate-500 italic">No hands raised at the moment.</span>
                  )}
                </div>

                {isHost && attendanceReport && (
                  <div className="flex flex-col gap-2 border-t border-slate-200 dark:border-slate-900 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500">Class Attendance</span>
                    <div className="flex flex-col gap-1 text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      <span>Total Checked In: {attendanceReport.summary?.totalAttended}</span>
                      <span>Completion count (80%+): {attendanceReport.summary?.completedCount}</span>
                      <span>Avg. Stay Time: {attendanceReport.summary?.averageDuration} min</span>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
export default LiveSession;
