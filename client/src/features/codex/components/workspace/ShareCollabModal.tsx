import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Check,
  Radio,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  RefreshCw,
  FolderTree,
  FileCode2,
} from 'lucide-react';
import { workspaceCollab, CollabConnectionStatus } from '../../services/yjsCollab';
import { realtimeSync, RemoteCursor } from '../../services/realtimeSync';

interface ShareCollabModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  currentFileName?: string;
}

export const ShareCollabModal: React.FC<ShareCollabModalProps> = ({
  isOpen,
  onClose,
  isDark,
  currentFileName,
}) => {
  const [copied, setCopied] = useState(false);
  const [collabStatus, setCollabStatus] = useState<CollabConnectionStatus>(workspaceCollab.status);
  const [peerCount, setPeerCount] = useState<number>(workspaceCollab.peerCount);
  const [roomId, setRoomId] = useState<string>(workspaceCollab.roomId);
  const [inputRoom, setInputRoom] = useState<string>(workspaceCollab.roomId);
  const [remotePeers, setRemotePeers] = useState<RemoteCursor[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    // Subscribe to Yjs connection and peer status
    const unsubCollab = workspaceCollab.onStateChange((status, count, activeRoom) => {
      setCollabStatus(status);
      setPeerCount(count);
      setRoomId(activeRoom);
      setInputRoom(activeRoom);
    });

    // Subscribe to active remote cursors/peers
    const unsubCursors = realtimeSync.subscribeToCursors((cursors) => {
      setRemotePeers([...cursors]);
    });

    return () => {
      unsubCollab();
      unsubCursors();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const inviteUrl = workspaceCollab.getShareUrl(roomId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSwitchRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputRoom.trim();
    if (trimmed && trimmed !== roomId) {
      workspaceCollab.setRoom(trimmed);
      setRoomId(trimmed);
    }
  };

  const handleGenerateNewRoom = () => {
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const newRoom = `workspace-${randomSuffix}`;
    setInputRoom(newRoom);
    workspaceCollab.setRoom(newRoom);
    setRoomId(newRoom);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden transition-all duration-200 ${
          isDark
            ? 'bg-slate-900 border-slate-800 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#04AA6D]/20 text-[#04AA6D] flex items-center justify-center shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Live Multiplayer Coding</h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#04AA6D]/20 text-[#04AA6D] border border-[#04AA6D]/30">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      collabStatus === 'connected'
                        ? 'bg-[#04AA6D] animate-pulse'
                        : collabStatus === 'connecting'
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-slate-400'
                    }`}
                  />
                  {collabStatus === 'connected'
                    ? 'CRDT Mesh Online'
                    : collabStatus === 'connecting'
                    ? 'Connecting...'
                    : 'Offline'}
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Code simultaneously with teammates in the same folder and files with zero conflicts.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition cursor-pointer text-sm ${
              isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-900'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Shareable Invite Link Card */}
          <div className="space-y-2">
            <label className={`text-xs font-semibold uppercase tracking-wider flex items-center justify-between ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <span>Shareable Collaboration Link</span>
              <span className="text-[10px] text-[#04AA6D] font-mono">Anyone with link can join</span>
            </label>
            <div className="flex items-center gap-2">
              <div
                className={`flex-1 flex items-center px-3 py-2 rounded-xl border text-xs font-mono select-all truncate ${
                  isDark
                    ? 'bg-slate-950 border-slate-800 text-sky-400'
                    : 'bg-slate-50 border-slate-200 text-sky-600'
                }`}
              >
                <span className="truncate">{inviteUrl}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#04AA6D] hover:bg-[#03985e] text-white text-xs font-medium shadow-xs transition cursor-pointer active:scale-95 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Room Controls */}
          <div
            className={`p-3.5 rounded-xl border space-y-2.5 ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Workspace Session Room</span>
              <button
                type="button"
                onClick={handleGenerateNewRoom}
                className="text-[11px] text-[#04AA6D] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Generate New Room</span>
              </button>
            </div>
            <form onSubmit={handleSwitchRoom} className="flex items-center gap-2">
              <input
                type="text"
                value={inputRoom}
                onChange={(e) => setInputRoom(e.target.value)}
                placeholder="Enter room name or ID"
                className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-[#04AA6D] ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />
              <button
                type="submit"
                disabled={inputRoom.trim() === roomId}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                Switch
              </button>
            </form>
          </div>

          {/* Active Peers in Room */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className={`font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Collaborators ({peerCount})
              </span>
              <span className="text-[11px] text-[#04AA6D] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#04AA6D] animate-ping" />
                Live Sync
              </span>
            </div>

            <div
              className={`rounded-xl border divide-y max-h-40 overflow-y-auto ${
                isDark
                  ? 'bg-slate-950/60 border-slate-800 divide-slate-800'
                  : 'bg-slate-50 border-slate-200 divide-slate-200'
              }`}
            >
              {/* Local User */}
              <div className="flex items-center justify-between p-2.5 text-xs">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-xs"
                    style={{ backgroundColor: realtimeSync.currentColor }}
                  >
                    {realtimeSync.currentUserName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>{realtimeSync.currentUserName}</span>
                      <span className="px-1.5 py-0.2 rounded bg-[#04AA6D]/20 text-[#04AA6D] text-[9px] font-mono">
                        You
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Viewing: {currentFileName || 'Workspace'}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-[#04AA6D] font-mono">Host / Active</div>
              </div>

              {/* Remote Peers */}
              {remotePeers.length > 0 ? (
                remotePeers.map((peer) => (
                  <div key={peer.userId} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-xs"
                        style={{ backgroundColor: peer.userColor }}
                      >
                        {peer.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{peer.userName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {peer.filePath ? `File: ${peer.filePath}` : 'Workspace Explorer'} • Line{' '}
                          {peer.lineNumber}:{peer.column}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-sky-400 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                      Editing
                    </div>
                  </div>
                ))
              ) : peerCount <= 1 ? (
                <div className="p-3 text-center text-xs text-slate-400 font-sans">
                  No other peers connected yet. Send the invite link above to code together!
                </div>
              ) : (
                <div className="p-2.5 text-xs text-slate-400 font-sans flex items-center justify-between">
                  <span>{peerCount - 1} remote collaborator(s) connected to this room</span>
                  <span className="text-[10px] text-[#04AA6D] font-mono">Synced</span>
                </div>
              )}
            </div>
          </div>

          {/* Highlights feature list */}
          <div
            className={`p-3 rounded-xl border text-[11px] grid grid-cols-2 gap-2 ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <FileCode2 className="w-3.5 h-3.5 text-[#04AA6D]" />
              <span>Simultaneous file typing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-blue-500" />
              <span>Real-time folder tree sync</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-500" />
              <span>Live cursors & selections</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>CRDT zero-conflict merge</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-end px-6 py-3 border-t ${
            isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
