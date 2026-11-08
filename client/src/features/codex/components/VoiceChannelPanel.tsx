import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  ExternalLink,
  Copy,
  Check,
  Mic,
  MicOff,
  Send,
  Users,
  MessageSquare,
  Sparkles,
  Shield,
  PhoneOff,
  Volume2
} from 'lucide-react';
import { realtimeSync, SyncPayload } from '../services/realtimeSync';
import { useAuth } from '../context/AuthContext';

interface VoiceChannelPanelProps {
  isDark: boolean;
  onCallStateChange?: (isInCall: boolean) => void;
  onFollowParticipant?: (name: string) => void;
}

export interface MeetAttendee {
  id: string;
  name: string;
  avatar?: string;
  color?: string;
  isSpeaking?: boolean;
  isMuted?: boolean;
  audioLevel?: number;
  isHost?: boolean;
  joinedAt?: string;
}

interface MeetChatMessage {
  sender: string;
  text: string;
  time: string;
}

export const VoiceChannelPanel: React.FC<VoiceChannelPanelProps> = ({
  isDark,
  onCallStateChange,
  onFollowParticipant,
}) => {
  const { user } = useAuth();

  // Google Meet URL state
  const [meetUrl, setMeetUrl] = useState(() => {
    return localStorage.getItem('codesphere_active_meet_url') || 'https://meet.google.com/new';
  });
  const [isMeetCopied, setIsMeetCopied] = useState(false);
  const [isInMeet, setIsInMeet] = useState(false);
  const [meetAttendees, setMeetAttendees] = useState<MeetAttendee[]>([]);

  // Local audio detection state
  const [myIsMuted, setMyIsMuted] = useState(false);
  const [myIsSpeaking, setMyIsSpeaking] = useState(false);
  const [myAudioLevel, setMyAudioLevel] = useState(0);

  // Audio analyser refs
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // In-Meet Quick Chat & Notes
  const [chatMessages, setChatMessages] = useState<MeetChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');

  // Notify parent of call state changes
  useEffect(() => {
    onCallStateChange?.(isInMeet);
  }, [isInMeet, onCallStateChange]);

  // Real-time synchronization for Google Meet status across teammates
  useEffect(() => {
    const unsubRealtime = realtimeSync.subscribe((payload: SyncPayload) => {
      if (payload.type === 'GOOGLE_MEET_UPDATE') {
        const data = payload.data as {
          url: string;
          action?: 'JOIN' | 'LEAVE' | 'QUERY' | 'ANNOUNCE' | 'STATUS_CHANGE';
          attendee?: MeetAttendee;
        };

        if (!data) return;

        if (data.action === 'JOIN' && data.attendee) {
          setMeetAttendees((prev) => {
            const exists = prev.some((a) => a.id === data.attendee!.id);
            if (exists) {
              return prev.map((a) => (a.id === data.attendee!.id ? { ...a, ...data.attendee } : a));
            }
            return [...prev, data.attendee!];
          });
        } else if (data.action === 'STATUS_CHANGE' && data.attendee) {
          setMeetAttendees((prev) =>
            prev.map((a) => (a.id === data.attendee!.id ? { ...a, ...data.attendee } : a))
          );
        } else if (data.action === 'LEAVE' && data.attendee) {
          setMeetAttendees((prev) => prev.filter((a) => a.id !== data.attendee!.id));
        } else if (data.action === 'QUERY' && isInMeet) {
          // Announce current state to newcomer
          realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
            url: meetUrl,
            action: 'ANNOUNCE',
            attendee: {
              id: realtimeSync.currentUserId,
              name: user?.fullName || 'Collaborator',
              avatar: user?.avatarUrl,
              color: realtimeSync.currentColor,
              isSpeaking: myIsSpeaking,
              isMuted: myIsMuted,
              audioLevel: myAudioLevel,
              isHost: true,
            },
          });
        } else if (data.action === 'ANNOUNCE' && data.attendee) {
          setMeetAttendees((prev) => {
            const exists = prev.some((a) => a.id === data.attendee!.id);
            if (exists) {
              return prev.map((a) => (a.id === data.attendee!.id ? { ...a, ...data.attendee } : a));
            }
            return [...prev, data.attendee!];
          });
        }
      } else if (payload.type === 'VOICE_EVENT') {
        const event = payload.data as {
          action: string;
          message?: MeetChatMessage;
        };
        if (event && event.action === 'CHAT' && event.message) {
          setChatMessages((prev) => [...prev, event.message!]);
        }
      }
    });

    return () => {
      unsubRealtime();
    };
  }, [isInMeet, meetUrl, myIsSpeaking, myIsMuted, myAudioLevel, user]);

  // Start local mic energy detection when inside Google Meet
  const startMicMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = stream;
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkAudio = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const normalized = Math.min(1, average / 128);
        setMyAudioLevel(normalized);

        const speaking = !myIsMuted && normalized > 0.08;
        setMyIsSpeaking((prevSpeaking) => {
          if (speaking !== prevSpeaking) {
            // Broadcast live speaking state update to teammates in workspace
            realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
              url: meetUrl,
              action: 'STATUS_CHANGE',
              attendee: {
                id: realtimeSync.currentUserId,
                name: user?.fullName || 'You',
                avatar: user?.avatarUrl,
                color: realtimeSync.currentColor,
                isSpeaking: speaking,
                isMuted: myIsMuted,
                audioLevel: normalized,
              },
            });

            // Update self in local list
            setMeetAttendees((prev) =>
              prev.map((a) =>
                a.id === realtimeSync.currentUserId
                  ? { ...a, isSpeaking: speaking, audioLevel: normalized }
                  : a
              )
            );
          }
          return speaking;
        });

        animFrameRef.current = requestAnimationFrame(checkAudio);
      };

      animFrameRef.current = requestAnimationFrame(checkAudio);
    } catch (err) {
      console.warn('Microphone energy detection unavailable:', err);
    }
  };

  const stopMicMonitoring = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setMyAudioLevel(0);
    setMyIsSpeaking(false);
  };

  const handleLaunchGoogleMeet = (urlToLaunch?: string) => {
    const target = urlToLaunch || meetUrl;
    window.open(target, '_blank', 'noopener,noreferrer');

    const selfAttendee: MeetAttendee = {
      id: realtimeSync.currentUserId,
      name: user?.fullName || 'You',
      avatar: user?.avatarUrl,
      color: realtimeSync.currentColor,
      isSpeaking: false,
      isMuted: false,
      audioLevel: 0,
      isHost: true,
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setIsInMeet(true);
    setMeetAttendees((prev) =>
      prev.some((a) => a.id === selfAttendee.id)
        ? prev.map((a) => (a.id === selfAttendee.id ? selfAttendee : a))
        : [...prev, selfAttendee]
    );

    realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
      url: target,
      action: 'JOIN',
      attendee: selfAttendee,
    });
    realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
      url: target,
      action: 'QUERY',
    });

    localStorage.setItem('codesphere_active_meet_url', target);
    startMicMonitoring();
  };

  const handleLeaveGoogleMeet = () => {
    stopMicMonitoring();
    setIsInMeet(false);
    setMeetAttendees((prev) => prev.filter((a) => a.id !== realtimeSync.currentUserId));

    realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
      url: meetUrl,
      action: 'LEAVE',
      attendee: { id: realtimeSync.currentUserId, name: user?.fullName || 'You' },
    });
  };

  const handleToggleMute = () => {
    const nextMuted = !myIsMuted;
    setMyIsMuted(nextMuted);
    if (nextMuted) {
      setMyIsSpeaking(false);
    }

    realtimeSync.broadcast('GOOGLE_MEET_UPDATE', {
      url: meetUrl,
      action: 'STATUS_CHANGE',
      attendee: {
        id: realtimeSync.currentUserId,
        name: user?.fullName || 'You',
        isMuted: nextMuted,
        isSpeaking: false,
        audioLevel: 0,
      },
    });

    setMeetAttendees((prev) =>
      prev.map((a) =>
        a.id === realtimeSync.currentUserId
          ? { ...a, isMuted: nextMuted, isSpeaking: false }
          : a
      )
    );
  };

  const handleCopyExternalMeetInvite = () => {
    const inviteText = `Join our CodeSphere Codex pair-programming session on Google Meet:\n${meetUrl}`;
    navigator.clipboard.writeText(inviteText);
    setIsMeetCopied(true);
    setTimeout(() => setIsMeetCopied(false), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const senderName = user?.fullName || 'You';
    const msg: MeetChatMessage = {
      sender: senderName,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, msg]);
    realtimeSync.broadcast('VOICE_EVENT', { action: 'CHAT', message: msg });
    setNewMessage('');
  };

  return (
    <div
      className={`h-full flex flex-col border-r select-none ${
        isDark
          ? 'bg-[#070a13] border-[#334155]/60 text-[#f8fafc]'
          : 'bg-[#f8fafc] border-[#e2e8f0] text-[#0f172a]'
      }`}
    >
      {/* Top Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b shrink-0 ${isDark ? 'border-[#334155]/40' : 'border-[#e2e8f0]'}`}>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-[#ea4335]/20 text-[#ea4335] flex items-center justify-center">
            <Video className="w-3 h-3" />
          </div>
          <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Google Meet & Live Calls
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[10px] font-mono">
          <span
            className={`w-2 h-2 rounded-full ${
              isInMeet ? 'bg-[#04AA6D] animate-ping' : 'bg-[#64748b]'
            }`}
          />
          <span className={isInMeet ? 'text-[#04AA6D] font-bold' : isDark ? 'text-[#94a3b8]' : 'text-slate-500'}>
            {isInMeet ? 'IN CALL' : 'STANDBY'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Google Meet Controller Card */}
        <div className={`p-3 rounded-xl border space-y-3 shadow-sm ${isDark ? 'bg-[#0f172a] border-[#334155]' : 'bg-white border-[#e2e8f0]'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ea4335] via-[#fbbc05] to-[#04AA6D] text-white flex items-center justify-center shadow-xs">
                <Video className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Google Meet Integration
                </div>
                <div className={`text-[10px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  Live status & speaker detection
                </div>
              </div>
            </div>

            <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40">
              Universal Video
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className={`block text-[10px] mb-1 font-medium ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
                Meeting Link (or New Instant Meeting)
              </label>
              <input
                type="text"
                value={meetUrl}
                onChange={(e) => setMeetUrl(e.target.value)}
                placeholder="https://meet.google.com/new"
                className={`w-full rounded px-2.5 py-1.5 text-xs outline-none font-mono border focus:border-[#04AA6D] ${
                  isDark
                    ? 'bg-[#020617] border-[#334155] text-white placeholder-zinc-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* In-Call Controls if joined */}
            {isInMeet && (
              <div className={`p-2.5 rounded-lg border flex items-center justify-between ${
                isDark ? 'bg-[#020617] border-[#334155]/70' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleMute}
                    className={`py-1 px-2 rounded-md text-xs font-semibold flex items-center gap-1 border transition cursor-pointer ${
                      myIsMuted
                        ? 'bg-[#ef4444]/20 border-[#ef4444]/50 text-[#ef4444]'
                        : 'bg-[#04AA6D]/20 border-[#04AA6D]/40 text-[#04AA6D]'
                    }`}
                  >
                    {myIsMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{myIsMuted ? 'Mic Muted' : 'Mic Active'}</span>
                  </button>

                  <div className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
                    {myIsSpeaking ? (
                      <span className="text-[#04AA6D] font-bold flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D]" />
                        Speaking
                      </span>
                    ) : (
                      <span>Silent</span>
                    )}
                  </div>
                </div>

                {/* Local Mic Volume Level Meter */}
                <div className="flex items-end gap-0.5 h-4 w-12 justify-center">
                  {[0.3, 0.7, 1.0, 0.6, 0.4].map((m, i) => (
                    <div
                      key={i}
                      className="w-1.5 bg-[#04AA6D] rounded-full transition-all duration-75"
                      style={{
                        height: myIsMuted ? '2px' : `${Math.max(2, myAudioLevel * 16 * m)}px`,
                        opacity: myIsMuted ? 0.2 : 0.6 + m * 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {isInMeet ? (
                <>
                  <button
                    onClick={() => handleLaunchGoogleMeet()}
                    className="py-1.5 px-3 bg-[#04AA6D] hover:bg-[#03945e] text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Focus Call</span>
                  </button>

                  <button
                    onClick={handleLeaveGoogleMeet}
                    className="py-1.5 px-3 bg-[#ef4444]/20 hover:bg-[#ef4444]/30 border border-[#ef4444]/50 text-[#ef4444] font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>Leave Call</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleLaunchGoogleMeet()}
                    className="py-1.5 px-3 bg-gradient-to-r from-[#ea4335] to-[#fbbc05] hover:opacity-90 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Launch Meet</span>
                  </button>

                  <button
                    onClick={handleCopyExternalMeetInvite}
                    className={`py-1.5 px-3 border font-medium text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isDark
                        ? 'bg-[#1e293b] hover:bg-[#283548] border-[#334155] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800'
                    }`}
                    title="Copy formatted invitation message with Google Meet link"
                  >
                    {isMeetCopied ? <Check className="w-3.5 h-3.5 text-[#04AA6D]" /> : <Copy className={`w-3.5 h-3.5 ${isDark ? 'text-[#00f2fe]' : 'text-blue-600'}`} />}
                    <span>{isMeetCopied ? 'Link Copied!' : 'Copy Guest Link'}</span>
                  </button>
                </>
              )}
            </div>

            <p className={`text-[10px] leading-tight ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>
              Click Launch Meet to join in Google Meet; your speaking and muted status are tracked live right here in the sidebar.
            </p>
          </div>
        </div>

        {/* Live Google Meet Attendees Section */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between text-[11px] font-bold px-1 uppercase tracking-wider ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            <span>People in Google Meet ({meetAttendees.length})</span>
            <Users className="w-3.5 h-3.5 text-[#04AA6D]" />
          </div>

          <div className="space-y-1.5">
            {meetAttendees.length === 0 ? (
              <div className={`p-4 rounded-xl border border-dashed text-center space-y-1.5 ${
                isDark ? 'border-[#334155] bg-[#020617]/50' : 'border-slate-300 bg-white'
              }`}>
                <Video className="w-6 h-6 mx-auto text-[#64748b]" />
                <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  No active Google Meet call
                </div>
                <div className={`text-[10px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                  Click <strong>Launch Meet</strong> above to join. Teammates who join will appear here with live speaking and mute indicators.
                </div>
              </div>
            ) : (
              meetAttendees.map((att) => {
                const isSelf = att.id === realtimeSync.currentUserId;
                const initials = att.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'U';

                return (
                  <div
                    key={att.id}
                    className={`p-2.5 rounded-xl border transition flex items-center justify-between ${
                      att.isSpeaking
                        ? isDark
                          ? 'bg-[#04AA6D]/15 border-[#04AA6D]/60 shadow-sm shadow-[#04AA6D]/10'
                          : 'bg-emerald-50/80 border-[#04AA6D] shadow-xs'
                        : isDark
                        ? 'bg-[#0f172a]/70 hover:bg-[#0f172a] border-[#334155]/60'
                        : 'bg-white hover:bg-slate-50 border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {att.avatar ? (
                          <img
                            src={att.avatar}
                            alt={att.name}
                            className="w-8 h-8 rounded-full object-cover border-2"
                            style={{ borderColor: att.isSpeaking ? '#04AA6D' : isDark ? '#334155' : '#e2e8f0' }}
                          />
                        ) : (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 border-2 transition-all"
                            style={{
                              backgroundColor: att.color || '#04AA6D',
                              borderColor: att.isSpeaking ? '#04AA6D' : isDark ? '#334155' : '#cbd5e1',
                              boxShadow: att.isSpeaking ? '0 0 10px rgba(4, 170, 109, 0.5)' : 'none',
                            }}
                          >
                            {initials}
                          </div>
                        )}

                        {/* Live Speaking Indicator Dot */}
                        {att.isSpeaking && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#04AA6D] ring-2 ring-white animate-ping" />
                        )}
                      </div>

                      <div>
                        <div className={`text-xs font-semibold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          <span>{att.name}</span>
                          {isSelf && (
                            <span className="text-[10px] text-[#04AA6D] font-mono">(You)</span>
                          )}
                          {att.isHost && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#3b82f6]/20 text-[#3b82f6] border border-[#3b82f6]/40 font-mono">
                              Host
                            </span>
                          )}
                        </div>

                        {/* Status Label */}
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {att.isSpeaking ? (
                            <span className="text-[10px] font-semibold text-[#04AA6D] flex items-center gap-1">
                              <Volume2 className="w-3 h-3 animate-pulse" />
                              <span>Speaking</span>
                            </span>
                          ) : att.isMuted ? (
                            <span className={`text-[10px] flex items-center gap-1 ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
                              <MicOff className="w-3 h-3" />
                              <span>Muted</span>
                            </span>
                          ) : (
                            <span className={`text-[10px] ${isDark ? 'text-[#94a3b8]' : 'text-slate-500'}`}>
                              In Call
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right visual indicator */}
                    <div>
                      {att.isSpeaking && (
                        <div className="flex items-end gap-0.5 h-4 px-2">
                          <span className="w-1 bg-[#04AA6D] h-2.5 rounded-full animate-bounce" />
                          <span className="w-1 bg-[#04AA6D] h-4 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 bg-[#04AA6D] h-2 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      )}
                      {att.isMuted && (
                        <div className="p-1 rounded-full bg-rose-500/10 text-rose-500">
                          <MicOff className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Real In-Session Quick Voice Chat & Code Sharing */}
        <div className="space-y-2">
          <div className={`flex items-center justify-between text-[11px] font-bold px-1 uppercase tracking-wider ${isDark ? 'text-[#94a3b8]' : 'text-slate-600'}`}>
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-[#04AA6D]" />
              <span>In-Call Chat & Notes</span>
            </div>
            {chatMessages.length > 0 && (
              <span className={`text-[10px] font-mono ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>{chatMessages.length} msgs</span>
            )}
          </div>

          <div className={`p-2.5 rounded-xl border space-y-2 max-h-36 overflow-y-auto text-xs ${
            isDark ? 'bg-[#020617] border-[#334155]/60' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            {chatMessages.length === 0 ? (
              <div className={`text-[11px] text-center py-2 ${isDark ? 'text-[#64748b]' : 'text-slate-500'}`}>
                Share snippets, links, or notes with call participants here.
              </div>
            ) : (
              chatMessages.map((msg, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-semibold text-[#04AA6D]">{msg.sender}</span>
                    <span className={`font-mono ${isDark ? 'text-[#71717a]' : 'text-slate-400'}`}>{msg.time}</span>
                  </div>
                  <div className={`text-[11px] leading-relaxed break-words ${isDark ? 'text-[#cbd5e1]' : 'text-slate-800'}`}>
                    {msg.text}
                  </div>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex items-center gap-1.5">
            <input
              type="text"
              placeholder="Send note to call..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={`flex-1 px-2.5 py-1.5 rounded-lg border text-xs outline-none focus:border-[#04AA6D] ${
                isDark
                  ? 'bg-[#020617] border-[#334155] text-white placeholder-zinc-500'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
              }`}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 rounded-lg bg-[#04AA6D] hover:bg-[#059669] disabled:opacity-40 text-white transition cursor-pointer"
              title="Send note"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
