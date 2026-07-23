import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Calendar, Clock, Users, ShieldAlert, BadgeInfo, Code, Download, Link as LinkIcon,
  Video, ArrowLeft, Star, Send, Bell, Plus, CheckCircle2, Lock, Sparkles, Trophy
} from 'lucide-react';
import {
  getSessionByIdThunk,
  registerSessionThunk,
  cancelRegistrationThunk,
} from '../redux/sessionThunk.js';
import { selectCurrentSession, selectSessionInteractivity } from '../redux/sessionSelectors.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';
import {
  publishSessionAPI,
  cancelSessionAPI,
  goLiveAPI,
  endSessionAPI,
  uploadResourceAPI,
  deleteResourceAPI,
  submitFeedbackAPI,
  createReminderAPI,
  generateCertificateAPI
} from '../services/sessionAPI.js';
import toast from 'react-hot-toast';

export const SessionDetails = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const session = useSelector(selectCurrentSession);
  const interactivity = useSelector(selectSessionInteractivity);
  const currentUser = useSelector(selectCurrentUser);

  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [resourceType, setResourceType] = useState('pdf');

  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');

  const [reminderType, setReminderType] = useState('1h');

  useEffect(() => {
    dispatch(getSessionByIdThunk(sessionId));
  }, [dispatch, sessionId]);

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading session particulars...
      </div>
    );
  }

  const isHost = session.host?._id === currentUser?._id;
  const isRegistered = interactivity.registrations?.some(
    (reg) => reg.userId?._id === currentUser?._id && reg.status === 'registered'
  ) || false;

  const handleRegister = async () => {
    try {
      await dispatch(registerSessionThunk(sessionId));
      toast.success('Successfully registered for session!');
    } catch (err) {
      toast.error(err.message || 'Failed to register');
    }
  };

  const handleCancelRegistration = async () => {
    try {
      await dispatch(cancelRegistrationThunk(sessionId));
      toast.success('Registration cancelled.');
    } catch (err) {
      toast.error(err.message || 'Failed to cancel registration');
    }
  };

  const handlePublish = async () => {
    try {
      await publishSessionAPI(sessionId);
      toast.success('Session published successfully!');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleCancelSession = async () => {
    try {
      await cancelSessionAPI(sessionId);
      toast.success('Session cancelled.');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGoLive = async () => {
    try {
      await goLiveAPI(sessionId);
      toast.success('Starting live webcast...');
      navigate(`/sessions/${sessionId}/live`);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEndSession = async () => {
    try {
      await endSessionAPI(sessionId);
      toast.success('Session ended.');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleUploadResource = async (e) => {
    e.preventDefault();
    if (!resourceTitle.trim() || !resourceUrl.trim()) {
      return toast.error('Please enter resource title and URL');
    }
    try {
      await uploadResourceAPI(sessionId, {
        title: resourceTitle.trim(),
        url: resourceUrl.trim(),
        resourceType,
      });
      toast.success('Resource added successfully!');
      setResourceTitle('');
      setResourceUrl('');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message || 'Failed to add resource');
    }
  };

  const handleDeleteResource = async (rId) => {
    try {
      await deleteResourceAPI(sessionId, rId);
      toast.success('Resource removed.');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await submitFeedbackAPI(sessionId, { rating, review });
      toast.success('Feedback submitted successfully! Thank you.');
      setReview('');
      dispatch(getSessionByIdThunk(sessionId));
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
    }
  };

  const handleConfigureReminder = async () => {
    try {
      await createReminderAPI(sessionId, { reminderType });
      toast.success(`Reminder set for ${reminderType} before the session.`);
    } catch (err) {
      toast.error(err.message || 'Failed to configure reminder');
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      const data = await generateCertificateAPI(sessionId);
      toast.success('Congratulations! Your completion certificate has been generated.');
      navigate('/sessions'); // redirect to list where tab can show certificates
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Verification failed. Attendance must exceed 80%.');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen text-slate-900 dark:text-slate-100 bg-white dark:bg-[#070a13] p-6 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-sm dark:shadow-2xl relative overflow-hidden font-sans transition-colors duration-200">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Back button */}
      <button
        onClick={() => navigate('/sessions')}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-colors text-xs font-bold uppercase tracking-wider self-start cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Webcasts
      </button>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 z-10">
        
        {/* Left Column: Details, Resources & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          
          {/* Header Card */}
          <div className="bg-slate-50/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl backdrop-blur-md flex flex-col gap-4">
            <div className="flex justify-between items-start gap-4">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-500/15 text-[#04AA6D] dark:text-emerald-400 border border-emerald-500/30 tracking-wider font-mono">
                {session.category}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                Capacity: {session.registeredCount} / {session.maxCapacity} Seats Taken
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mt-2">
              {session.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-sans mt-1">
              {session.description}
            </p>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {session.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Instructor and Guest speakers info */}
          <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Host & Speaker Profile</h3>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0">
                {session.host?.avatar ? (
                  <img src={session.host.avatar} alt={session.host.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm font-black text-[#04AA6D] dark:text-emerald-400">
                    {session.host?.fullName?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{session.host?.fullName}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{session.host?.bio || 'Senior Technical Instructor'}</span>
              </div>
            </div>
          </div>

          {/* Resources checklist */}
          <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Session Resources</h3>
            
            <div className="flex flex-col gap-3">
              {interactivity.resources?.length > 0 ? (
                interactivity.resources.map((res) => (
                  <div key={res._id} className="flex justify-between items-center bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-900 p-3 rounded-xl hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-lg">
                        {res.resourceType === 'link' || res.resourceType === 'github' ? (
                          <LinkIcon className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                        ) : (
                          <Download className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{res.title}</span>
                        <span className="text-[10px] text-slate-500 uppercase font-mono">{res.resourceType}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 rounded-lg text-slate-600 dark:text-slate-400 hover:text-[#04AA6D] dark:hover:text-emerald-400 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                      {isHost && (
                        <button
                          onClick={() => handleDeleteResource(res._id)}
                          className="p-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-rose-50 dark:hover:bg-rose-950/20 border border-slate-200 dark:border-slate-800 hover:border-rose-500/20 rounded-lg text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-all"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic py-2">
                  No resources uploaded for this webcast yet.
                </div>
              )}
            </div>

            {/* Instructor resources form */}
            {isHost && (
              <form onSubmit={handleUploadResource} className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Add Resource</span>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Resource Title"
                    value={resourceTitle}
                    onChange={(e) => setResourceTitle(e.target.value)}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL (HTTP/HTTPS)"
                    value={resourceUrl}
                    onChange={(e) => setResourceUrl(e.target.value)}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
                  />
                </div>
                <div className="flex justify-between items-center gap-4">
                  <select
                    value={resourceType}
                    onChange={(e) => setResourceType(e.target.value)}
                    className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-600 dark:text-slate-400 focus:outline-none"
                  >
                    <option value="pdf">PDF Slide</option>
                    <option value="notes">Notes Sheet</option>
                    <option value="slide">Presentation</option>
                    <option value="github">GitHub Repo</option>
                    <option value="link">Web link</option>
                  </select>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#04AA6D] hover:bg-[#03935e] text-white transition-all shadow-md cursor-pointer"
                  >
                    Upload Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Timings, Registrations, Live Buttons, Feedback */}
        <div className="flex flex-col gap-6">
          
          {/* Scheduling particulars card */}
          <div className="bg-slate-50/80 dark:bg-slate-950/30 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl backdrop-blur-md flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Session Schedule</h3>
            
            <div className="flex flex-col gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                <span>Start: {new Date(session.startTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                <span>Duration: {session.duration} minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <BadgeInfo className="w-4 h-4 text-[#04AA6D] dark:text-emerald-400" />
                <span className="capitalize">Status: <strong className="text-[#04AA6D] dark:text-emerald-400 font-bold">{session.status}</strong></span>
              </div>
            </div>

            {/* Student Registration Flow */}
            {!isHost && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-3">
                {session.status === 'upcoming' && (
                  isRegistered ? (
                    <button
                      onClick={handleCancelRegistration}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 transition-all select-none uppercase tracking-wider cursor-pointer"
                    >
                      Cancel Registration
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={session.registeredCount >= session.maxCapacity && !session.isWaitlistEnabled}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 active:scale-95 disabled:opacity-50 text-white transition-all select-none uppercase tracking-wider cursor-pointer shadow-md"
                    >
                      {session.registeredCount >= session.maxCapacity ? 'Join Waitlist' : 'Register for Webcast'}
                    </button>
                  )
                )}

                {/* Reminder Settings */}
                {isRegistered && session.status === 'upcoming' && (
                  <div className="mt-2 flex flex-col gap-2.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-500 flex items-center gap-1">
                      <Bell className="w-3.5 h-3.5 text-[#04AA6D] dark:text-emerald-400" />
                      Configure Reminders
                    </span>
                    <div className="flex gap-2">
                      <select
                        value={reminderType}
                        onChange={(e) => setReminderType(e.target.value)}
                        className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-700 dark:text-slate-400 focus:outline-none flex-1"
                      >
                        <option value="15min">15 Minutes Before</option>
                        <option value="1h">1 Hour Before</option>
                        <option value="24h">1 Day Before</option>
                      </select>
                      <button
                        onClick={handleConfigureReminder}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/20 text-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}

                {/* Join Live Webcast (Students only join if session status is live) */}
                {session.status === 'live' && isRegistered && (
                  <button
                    onClick={() => navigate(`/sessions/${sessionId}/live`)}
                    className="w-full py-3.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#04AA6D] to-teal-600 text-white animate-pulse shadow-xl shadow-emerald-500/30 uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    Enter Live Classroom
                  </button>
                )}

                {/* Certificate Claim */}
                {session.status === 'completed' && (
                  <button
                    onClick={handleGenerateCertificate}
                    className="w-full py-3 rounded-xl font-extrabold text-xs bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 text-white transition-all uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Claim Certificate
                  </button>
                )}
              </div>
            )}

            {/* Host Lifecycle Flow */}
            {isHost && (
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-900 flex flex-col gap-3">
                {session.status === 'draft' && (
                  <button
                    onClick={handlePublish}
                    className="w-full py-3 rounded-xl font-bold text-xs bg-[#04AA6D] hover:bg-[#03935e] text-white transition-all uppercase tracking-wider shadow-md cursor-pointer"
                  >
                    Publish Webcast
                  </button>
                )}

                {session.status === 'upcoming' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleGoLive}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#04AA6D] to-teal-600 hover:from-[#03935e] hover:to-teal-500 text-white transition-all uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      Start Live Webcast
                    </button>
                    <button
                      onClick={handleCancelSession}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 text-rose-600 dark:text-rose-400 transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Cancel Webcast
                    </button>
                  </div>
                )}

                {session.status === 'live' && (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/sessions/${sessionId}/live`)}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white transition-all uppercase tracking-wider cursor-pointer"
                    >
                      Go to Classroom View
                    </button>
                    <button
                      onClick={handleEndSession}
                      className="w-full py-3 rounded-xl font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-all uppercase tracking-wider shadow-md cursor-pointer"
                    >
                      End Webcast
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Feedback Form */}
          {session.status === 'completed' && (
            <div className="bg-slate-50/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-900 p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Leave Your Feedback</h3>
              
              <form onSubmit={handleSubmitFeedback} className="flex flex-col gap-3.5">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-slate-400 dark:text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-400 dark:text-slate-600'}`} />
                    </button>
                  ))}
                </div>

                <textarea
                  placeholder="Tell us what you liked or how we can improve the course content..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  rows="3"
                  className="bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-all font-sans"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-bold bg-[#04AA6D] hover:bg-[#03935e] text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Feedback
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
