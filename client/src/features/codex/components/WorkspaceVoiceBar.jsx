import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, PhoneCall, PhoneOff, Radio, Users, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export const WorkspaceVoiceBar = ({ socket, workspaceId, currentUser, onlineUsers = [] }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [activeVoiceUsers, setActiveVoiceUsers] = useState([]);
  
  const localStreamRef = useRef(null);
  const peerConnections = useRef({}); // userId -> RTCPeerConnection

  const STUN_SERVERS = {
    iceServers: [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] }]
  };

  useEffect(() => {
    if (!socket) return;

    // Listen for WebRTC Signaling Events
    socket.on('voice_user_joined', async ({ userId, fullName }) => {
      toast.success(`${fullName} joined voice channel`);
      setActiveVoiceUsers(prev => [...prev.filter(u => u.userId !== userId), { userId, fullName, isMuted: false }]);
      if (isConnected) {
        initiatePeerConnection(userId, true);
      }
    });

    socket.on('voice_user_left', ({ userId, fullName }) => {
      toast.error(`${fullName} left voice channel`);
      setActiveVoiceUsers(prev => prev.filter(u => u.userId !== userId));
      if (peerConnections.current[userId]) {
        peerConnections.current[userId].close();
        delete peerConnections.current[userId];
      }
    });

    socket.on('voice_offer', async ({ senderId, sdp }) => {
      if (!isConnected) return;
      const pc = getOrCreatePeerConnection(senderId);
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit('voice_answer', { workspaceId, targetUserId: senderId, sdp: answer });
    });

    socket.on('voice_answer', async ({ senderId, sdp }) => {
      const pc = peerConnections.current[senderId];
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      }
    });

    socket.on('voice_ice_candidate', async ({ senderId, candidate }) => {
      const pc = peerConnections.current[senderId];
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {});
      }
    });

    socket.on('voice_state_changed', ({ userId, isMuted }) => {
      setActiveVoiceUsers(prev => prev.map(u => u.userId === userId ? { ...u, isMuted } : u));
    });

    return () => {
      socket.off('voice_user_joined');
      socket.off('voice_user_left');
      socket.off('voice_offer');
      socket.off('voice_answer');
      socket.off('voice_ice_candidate');
      socket.off('voice_state_changed');
    };
  }, [socket, isConnected, workspaceId]);

  const getOrCreatePeerConnection = (targetUserId) => {
    if (peerConnections.current[targetUserId]) return peerConnections.current[targetUserId];

    const pc = new RTCPeerConnection(STUN_SERVERS);
    peerConnections.current[targetUserId] = pc;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));
    }

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('voice_ice_candidate', { workspaceId, targetUserId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      const remoteAudio = new Audio();
      remoteAudio.srcObject = event.streams[0];
      remoteAudio.autoplay = true;
    };

    return pc;
  };

  const initiatePeerConnection = async (targetUserId) => {
    const pc = getOrCreatePeerConnection(targetUserId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('voice_offer', { workspaceId, targetUserId, sdp: offer });
  };

  const handleToggleVoiceConnect = async () => {
    if (isConnected) {
      // Disconnect
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      Object.values(peerConnections.current).forEach(pc => pc.close());
      peerConnections.current = {};
      setIsConnected(false);
      socket.emit('voice_leave', { workspaceId });
      toast('Left voice room');
    } else {
      // Connect
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        localStreamRef.current = stream;
        setIsConnected(true);
        socket.emit('voice_join', { workspaceId });
        toast.success('Connected to Live Audio Channel!');
      } catch (err) {
        toast.error('Microphone access denied or unavailable.');
      }
    }
  };

  const handleToggleMute = () => {
    if (!localStreamRef.current) return;
    const audioTrack = localStreamRef.current.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      socket.emit('voice_state_toggle', { workspaceId, isMuted: !audioTrack.enabled, isDeafened });
    }
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-200 text-xs font-sans select-none">
      {/* Status & Members */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Radio className={`w-4 h-4 ${isConnected ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="font-bold text-white font-mono uppercase text-[11px]">
            {isConnected ? 'Voice Channel Active' : 'Live Audio Channel'}
          </span>
        </div>

        {isConnected && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
              <Sparkles size={10} /> {activeVoiceUsers.length + 1} Connected
            </span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {isConnected && (
          <>
            <button
              onClick={handleToggleMute}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setIsDeafened(!isDeafened)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isDeafened
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
              title={isDeafened ? 'Undeafen Audio' : 'Deafen Audio'}
            >
              {isDeafened ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          </>
        )}

        <button
          onClick={handleToggleVoiceConnect}
          className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            isConnected
              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
              : 'bg-[#04AA6D] hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
          }`}
        >
          {isConnected ? (
            <>
              <PhoneOff className="w-3.5 h-3.5" />
              Disconnect
            </>
          ) : (
            <>
              <PhoneCall className="w-3.5 h-3.5" />
              Join Voice
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default WorkspaceVoiceBar;
