import * as Y from 'yjs';
import type { MonacoBinding } from 'y-monaco';
import type { editor } from 'monaco-editor';
import type { WorkspaceFile } from '../types/codex';

let MonacoBindingClass: typeof MonacoBinding | null = null;
async function loadMonacoBinding() {
  if (!MonacoBindingClass && typeof window !== 'undefined') {
    try {
      const mod = await import('y-monaco');
      MonacoBindingClass = mod.MonacoBinding;
    } catch (e) {
      console.warn('Failed to dynamically load y-monaco:', e);
    }
  }
  return MonacoBindingClass;
}

export interface CollabUser {
  id: string;
  name: string;
  color: string;
}

export type CollabConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export interface CollabStateListener {
  (status: CollabConnectionStatus, peerCount: number, roomId: string): void;
}

const DEFAULT_ROOM = 'codesphere-main-room';

const USER_COLORS = [
  '#04AA6D', // Codex Emerald
  '#3b82f6', // Electric Blue
  '#f59e0b', // Amber
  '#ec4899', // Magenta
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#10b981', // Mint
];

export class YjsWorkspaceCollab {
  public doc: Y.Doc;
  private ws: WebSocket | null = null;
  private binding: MonacoBinding | null = null;
  public roomId: string;
  public currentUser: CollabUser;
  public status: CollabConnectionStatus = 'disconnected';
  public peerCount = 1;

  private stateListeners: Set<CollabStateListener> = new Set();
  private textObserver: ((event: Y.YTextEvent) => void) | null = null;
  private currentBoundFileKey: string | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(customRoomId?: string, user?: CollabUser) {
    // Read initial room from URL query param if present
    const urlRoom =
      typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('room')
        : null;

    this.roomId = customRoomId || urlRoom || DEFAULT_ROOM;

    const randomColor = USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
    const randomId = `user_${Math.random().toString(36).substring(2, 7)}`;
    this.currentUser = user || {
      id: randomId,
      name: 'Developer',
      color: randomColor,
    };

    this.doc = new Y.Doc();
    this.initWebSocket();
  }

  public setRoom(newRoomId: string) {
    if (!newRoomId || newRoomId === this.roomId) return;
    this.roomId = newRoomId.trim();

    // Clean up current binding & socket
    if (this.binding) {
      this.binding.destroy();
      this.binding = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.doc.destroy();
    this.doc = new Y.Doc();

    // Update browser URL without reload for seamless sharing
    if (typeof window !== 'undefined' && window.history?.pushState) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', this.roomId);
      window.history.pushState({}, '', url.toString());
    }

    this.initWebSocket();
  }

  public setUserProfile(name: string, color?: string) {
    this.currentUser.name = name;
    if (color) this.currentUser.color = color;
    this.sendAwareness({
      type: 'user_update',
      user: this.currentUser,
    });
  }

  private initWebSocket() {
    if (typeof window === 'undefined') return;

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    this.setStatus('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // In dev environment Vite proxies /collab to port 4000. Fallback directly to 4000 if needed.
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/collab?room=${encodeURIComponent(this.roomId)}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        this.setStatus('connected');
        // Announce join
        this.sendAwareness({
          type: 'join',
          user: this.currentUser,
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'sync' || data.type === 'update') {
            const binary = Uint8Array.from(atob(data.update), (c) => c.charCodeAt(0));
            Y.applyUpdate(this.doc, binary, 'remote');
          } else if (data.type === 'room_peers') {
            this.peerCount = data.count || 1;
            this.notifyState();
          } else if (data.type === 'awareness' && data.sync_event) {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(
                new CustomEvent('codesphere_ws_collab_event', { detail: data.sync_event })
              );
            }
          }
        } catch (e) {
          console.warn('Yjs message handling error:', e);
        }
      };

      this.ws.onclose = () => {
        this.setStatus('disconnected');
        // Auto-reconnect after 3 seconds
        this.reconnectTimeout = setTimeout(() => {
          this.initWebSocket();
        }, 3000);
      };

      this.ws.onerror = () => {
        this.setStatus('disconnected');
      };

      // Broadcast local document changes to other connected clients
      this.doc.on('update', (update, origin) => {
        if (origin !== 'remote' && this.ws && this.ws.readyState === WebSocket.OPEN) {
          const base64 = btoa(String.fromCharCode(...update));
          this.ws.send(JSON.stringify({ type: 'update', update: base64 }));
        }
      });
    } catch {
      this.setStatus('disconnected');
    }
  }

  private setStatus(status: CollabConnectionStatus) {
    this.status = status;
    this.notifyState();
  }

  private notifyState() {
    this.stateListeners.forEach((listener) => {
      try {
        listener(this.status, this.peerCount, this.roomId);
      } catch (e) {
        console.error('Error in collab state listener', e);
      }
    });
  }

  public onStateChange(listener: CollabStateListener): () => void {
    this.stateListeners.add(listener);
    listener(this.status, this.peerCount, this.roomId);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  /**
   * Binds Monaco editor instance to the shared Y.Text type for the active file.
   * Ensures non-destructive CRDT multi-user editing with remote updates.
   */
  public bindEditor(
    monacoEditor: editor.IStandaloneCodeEditor,
    fileKey: string,
    initialContent?: string,
    onRemoteChange?: (content: string) => void
  ) {
    // Unbind previous file if changing files
    if (this.binding) {
      try {
        this.binding.destroy();
      } catch {}
      this.binding = null;
    }

    if (this.textObserver && this.currentBoundFileKey) {
      const prevText = this.doc.getText(this.currentBoundFileKey);
      prevText.unobserve(this.textObserver);
      this.textObserver = null;
    }

    this.currentBoundFileKey = fileKey;
    const ytext = this.doc.getText(fileKey);
    const model = monacoEditor.getModel();
    if (!model) return;

    // CRITICAL: If this is the first time the file is opened in Yjs and it's empty,
    // seed Y.Text with existing file content so it does not clear out local work.
    if (ytext.length === 0 && initialContent && initialContent.length > 0) {
      ytext.insert(0, initialContent);
    } else if (ytext.length === 0 && model.getValue().length > 0) {
      ytext.insert(0, model.getValue());
    } else if (ytext.length > 0) {
      const currentYText = ytext.toString();
      if (model.getValue() !== currentYText) {
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text: currentYText }],
          () => null
        );
        onRemoteChange?.(currentYText);
      }
    }

    loadMonacoBinding().then((BindingClass) => {
      if (!BindingClass) return;
      try {
        this.binding = new BindingClass(
          ytext,
          model,
          new Set([monacoEditor])
        );
      } catch (e) {
        console.warn('MonacoBinding initialize warning:', e);
      }
    });

    // Notify caller when collaborative changes arrive so local store reflects updates
    this.textObserver = () => {
      const text = ytext.toString();
      onRemoteChange?.(text);
      if (monacoEditor && monacoEditor.getModel() && monacoEditor.getModel()!.getValue() !== text) {
        const model = monacoEditor.getModel()!;
        model.pushEditOperations(
          [],
          [{ range: model.getFullModelRange(), text }],
          () => null
        );
      }
    };
    ytext.observe(this.textObserver);
  }

  public unbindCurrentEditor() {
    if (this.binding) {
      try {
        this.binding.destroy();
      } catch {}
      this.binding = null;
    }
    if (this.textObserver && this.currentBoundFileKey) {
      const prevText = this.doc.getText(this.currentBoundFileKey);
      prevText.unobserve(this.textObserver);
      this.textObserver = null;
    }
    this.currentBoundFileKey = null;
  }

  public sendAwareness(payload: Record<string, unknown>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'awareness',
          roomId: this.roomId,
          ...payload,
        })
      );
    }
  }

  public getShareUrl(customRoomId?: string): string {
    const room = customRoomId || this.roomId;
    if (typeof window === 'undefined') return `?room=${room}`;
    const url = new URL(window.location.origin);
    url.searchParams.set('room', room);
    return url.toString();
  }

  public syncWorkspaceState(data: {
    folderName: string;
    workspacePath: string;
    files: WorkspaceFile[];
    activeFileId: string | null;
  }) {
    if (this.doc) {
      const wsMap = this.doc.getMap('workspace_state');
      this.doc.transact(() => {
        wsMap.set('folderName', data.folderName);
        wsMap.set('workspacePath', data.workspacePath);
        wsMap.set('files', JSON.stringify(data.files));
        if (data.activeFileId) {
          wsMap.set('activeFileId', data.activeFileId);
        }
      }, 'local_workspace_sync');
    }
  }

  public onWorkspaceStateChange(
    callback: (data: {
      folderName: string;
      workspacePath: string;
      files: WorkspaceFile[];
      activeFileId: string | null;
    }) => void
  ): () => void {
    const wsMap = this.doc.getMap('workspace_state');
    const notifyIfRemote = () => {
      const folderName = wsMap.get('folderName') as string | undefined;
      const workspacePath = wsMap.get('workspacePath') as string | undefined;
      const filesJson = wsMap.get('files') as string | undefined;
      const activeFileId = (wsMap.get('activeFileId') as string) || null;

      if (filesJson && folderName) {
        try {
          const files = JSON.parse(filesJson) as WorkspaceFile[];
          if (Array.isArray(files) && files.length > 0) {
            callback({
              folderName,
              workspacePath: workspacePath || folderName,
              files,
              activeFileId,
            });
          }
        } catch (e) {
          console.warn('Failed to parse collaborative workspace state:', e);
        }
      }
    };

    const observer = (event: Y.YMapEvent<unknown>) => {
      if (event.transaction.origin === 'local_workspace_sync') {
        return;
      }
      notifyIfRemote();
    };

    wsMap.observe(observer);
    // If state already exists from server sync, trigger asynchronously
    if (wsMap.has('files') && wsMap.has('folderName')) {
      setTimeout(() => notifyIfRemote(), 0);
    }

    return () => {
      wsMap.unobserve(observer);
    };
  }

  public destroy() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.unbindCurrentEditor();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.doc.destroy();
  }
}

// Global shared collaboration session
export const workspaceCollab = new YjsWorkspaceCollab();
