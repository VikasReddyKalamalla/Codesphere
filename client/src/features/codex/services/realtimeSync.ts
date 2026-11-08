import { WorkspaceFile } from '../types/codex';
import { workspaceCollab } from './yjsCollab';

export type SyncEventType =
  | 'FILE_CONTENT_CHANGE'
  | 'CURSOR_MOVE'
  | 'FILE_CREATED'
  | 'FILE_DELETED'
  | 'FILE_RENAMED'
  | 'PEER_JOIN'
  | 'PEER_LEAVE'
  | 'EXECUTE_CODE'
  | 'GOOGLE_MEET_UPDATE'
  | 'VOICE_EVENT'
  | 'KANBAN_UPDATE'
  | 'REQUEST_WORKSPACE_SYNC'
  | 'WORKSPACE_SYNC_RESPONSE'
  | 'WORKSPACE_UPDATE';

export interface RemoteSelection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface RemoteCursor {
  userId: string;
  userName: string;
  userColor: string;
  filePath: string;
  lineNumber: number;
  column: number;
  selection?: RemoteSelection | null;
  lastUpdated: number;
}

export interface SyncPayload {
  type: SyncEventType;
  senderId: string;
  senderName: string;
  senderColor: string;
  timestamp: number;
  data: unknown;
}

const PEER_COLORS = [
  '#04AA6D', // Codex Emerald
  '#3b82f6', // Electric Blue
  '#f59e0b', // Amber
  '#ec4899', // Magenta
  '#8b5cf6', // Indigo Violet
  '#06b6d4', // Cyan
  '#f97316', // Coral
  '#10b981', // Mint
];

class RealtimeSyncService {
  private channel: BroadcastChannel | null = null;
  private listeners: ((payload: SyncPayload) => void)[] = [];
  private cursorListeners: ((cursors: RemoteCursor[]) => void)[] = [];
  private remoteCursors: Map<string, RemoteCursor> = new Map();
  private lastBroadcastTime = 0;

  public currentUserId: string = `user_${Math.random().toString(36).substring(2, 7)}`;
  public currentUserName: string = (() => {
    try {
      const explicit = localStorage.getItem('codesphere_username');
      if (explicit) return explicit;
      const csUserStr = localStorage.getItem('codesphere_user') || localStorage.getItem('user');
      if (csUserStr) {
        const u = JSON.parse(csUserStr);
        if (u?.name || u?.username) return u.name || u.username;
      }
      return 'Developer';
    } catch {
      return 'Developer';
    }
  })();
  public currentColor: string;

  constructor() {
    this.currentColor = PEER_COLORS[Math.floor(Math.random() * PEER_COLORS.length)];

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('codesphere-codex-sync-v2');
        this.channel.onmessage = (event) => {
          const payload = event.data as SyncPayload;
          if (payload && payload.senderId !== this.currentUserId) {
            this.handleIncomingPayload(payload);
          }
        };

        // Broadcast join event on start
        window.addEventListener('beforeunload', () => {
          this.broadcast('PEER_LEAVE', { userId: this.currentUserId });
        });

        setTimeout(() => {
          this.broadcast('PEER_JOIN', {
            userId: this.currentUserId,
            userName: this.currentUserName,
            userColor: this.currentColor,
          });
        }, 500);
      } catch (err) {
        console.warn('BroadcastChannel initialization failed, falling back to local sync', err);
      }
    }

    // Also receive network events relayed from other machines through the WebSocket room
    if (typeof window !== 'undefined') {
      window.addEventListener('codesphere_ws_collab_event', ((e: CustomEvent<SyncPayload>) => {
        if (e.detail && e.detail.senderId !== this.currentUserId) {
          this.handleIncomingPayload(e.detail);
        }
      }) as EventListener);
    }
  }

  public setUsername(name: string) {
    if (!name || name.trim() === '' || name === this.currentUserName) return;
    this.currentUserName = name.trim();
    try {
      localStorage.setItem('codesphere_username', this.currentUserName);
    } catch {}
    this.broadcast('PEER_JOIN', {
      userId: this.currentUserId,
      userName: this.currentUserName,
      userColor: this.currentColor,
    });
  }

  private handleIncomingPayload(payload: SyncPayload) {
    if (!payload || payload.senderId === this.currentUserId) return;

    if (payload.type === 'CURSOR_MOVE') {
      const data = payload.data as
        | {
            filePath?: string;
            row?: number;
            col?: number;
            lineNumber?: number;
            column?: number;
            selection?: RemoteSelection | null;
          }
        | undefined;
      const { filePath, row, col, lineNumber, column, selection } = data || {};
      const line = lineNumber ?? row ?? 1;
      const c = column ?? col ?? 1;

      // Only track cursor if a concrete file path is provided
      if (filePath && filePath.trim().length > 0) {
        this.remoteCursors.set(payload.senderId, {
          userId: payload.senderId,
          userName: payload.senderName || 'Collaborator',
          userColor: payload.senderColor || '#3b82f6',
          filePath: filePath.trim(),
          lineNumber: line,
          column: c,
          selection: selection || null,
          lastUpdated: Date.now(),
        });

        this.notifyCursorListeners();
      }
    } else if (payload.type === 'PEER_LEAVE') {
      this.remoteCursors.delete(payload.senderId);
      this.notifyCursorListeners();
    } else if (payload.type === 'PEER_JOIN') {
      // Clean up any stale cursor entry for joining peer until they actively navigate a file
      this.remoteCursors.delete(payload.senderId);
    }

    this.notifyListeners(payload);
  }

  public subscribe(callback: (payload: SyncPayload) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public subscribeToCursors(callback: (cursors: RemoteCursor[]) => void) {
    this.cursorListeners.push(callback);
    // Call immediately with existing cursors
    callback(this.getRemoteCursors());
    return () => {
      this.cursorListeners = this.cursorListeners.filter((cb) => cb !== callback);
    };
  }

  public getRemoteCursors(): RemoteCursor[] {
    const now = Date.now();
    const active: RemoteCursor[] = [];
    this.remoteCursors.forEach((c) => {
      // Exclude self and keep active cursors for 2 minutes of idle time
      if (c.userId !== this.currentUserId && now - c.lastUpdated < 120000) {
        active.push(c);
      }
    });
    return active;
  }

  private notifyCursorListeners() {
    const cursors = this.getRemoteCursors();
    this.cursorListeners.forEach((cb) => {
      try {
        cb(cursors);
      } catch (e) {
        console.error('Error in cursor listener', e);
      }
    });
  }

  private notifyListeners(payload: SyncPayload) {
    this.listeners.forEach((cb) => {
      try {
        cb(payload);
      } catch (e) {
        console.error('Error in realtime sync listener', e);
      }
    });
  }

  public broadcast(type: SyncEventType, data: unknown) {
    const payload: SyncPayload = {
      type,
      senderId: this.currentUserId,
      senderName: this.currentUserName,
      senderColor: this.currentColor,
      timestamp: Date.now(),
      data,
    };

    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (e) {
        console.warn('Failed to broadcast event', e);
      }
    }

    // Also broadcast across the network via WebSocket room
    try {
      workspaceCollab.sendAwareness({ sync_event: payload });
    } catch {}
  }

  public broadcastCodeChange(fileId: string, path: string, content: string) {
    this.broadcast('FILE_CONTENT_CHANGE', { fileId, path, content });
  }

  public broadcastCursor(
    filePath: string,
    lineNumber: number,
    column: number,
    selection?: RemoteSelection | null
  ) {
    const now = Date.now();
    // Throttle cursor broadcasts to 40ms (~25fps) for butter-smooth network performance
    if (now - this.lastBroadcastTime < 40) return;
    this.lastBroadcastTime = now;

    this.broadcast('CURSOR_MOVE', {
      filePath,
      lineNumber,
      column,
      selection,
    });
  }

  public broadcastFileCreated(file: WorkspaceFile) {
    this.broadcast('FILE_CREATED', { file });
  }

  public broadcastFileDeleted(fileId: string) {
    this.broadcast('FILE_DELETED', { fileId });
  }

  public broadcastFileRenamed(fileId: string, newName: string) {
    this.broadcast('FILE_RENAMED', { fileId, newName });
  }

  public requestWorkspaceSync() {
    this.broadcast('REQUEST_WORKSPACE_SYNC', {});
  }

  public broadcastWorkspaceSync(data: {
    folderName: string;
    workspacePath: string;
    files: WorkspaceFile[];
    activeFileId: string | null;
  }) {
    this.broadcast('WORKSPACE_SYNC_RESPONSE', data);
  }

  public broadcastWorkspaceUpdate(data: {
    folderName: string;
    workspacePath: string;
    files: WorkspaceFile[];
    activeFileId: string | null;
  }) {
    this.broadcast('WORKSPACE_UPDATE', data);
  }

  /**
   * Set user profile details for collaboration
   */
  public setUserProfile(name: string, color?: string) {
    this.currentUserName = name;
    if (color) this.currentColor = color;
  }
}

export const realtimeSync = new RealtimeSyncService();
