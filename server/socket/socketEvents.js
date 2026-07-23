/**
 * Centralised registry of all Socket.IO event name constants.
 * Import this anywhere you need event names to avoid magic strings.
 */
const EVENTS = {
  // ─── Connection ──────────────────────────────────────────────────────────────
  CONNECTION:   'connection',
  DISCONNECT:   'disconnect',

  // ─── Community Chat ───────────────────────────────────────────────────────────
  CHAT_JOIN:         'chat:join',
  CHAT_LEAVE:        'chat:leave',
  CHAT_MESSAGE:      'chat:message',
  CHAT_EDIT:         'chat:edit',
  CHAT_DELETE:       'chat:delete',
  CHAT_REACT:        'chat:react',
  CHAT_PIN:          'chat:pin',
  CHAT_READ:         'chat:read',
  CHAT_HISTORY:      'chat:history',
  CHAT_TYPING:       'chat:typing',
  CHAT_STOP_TYPING:  'chat:stopTyping',
  // Server → client
  CHAT_JOINED:        'chat:joined',
  CHAT_USER_JOINED:   'chat:userJoined',
  CHAT_USER_LEFT:     'chat:userLeft',
  CHAT_NEW_MESSAGE:   'chat:newMessage',
  CHAT_MSG_EDITED:    'chat:messageEdited',
  CHAT_MSG_DELETED:   'chat:messageDeleted',
  CHAT_REACTED:       'chat:reacted',
  CHAT_PINNED:        'chat:pinned',

  // ─── Workspace (Codex) ────────────────────────────────────────────────────────
  WS_JOIN:          'workspace:join',
  WS_LEAVE:         'workspace:leave',
  WS_TASK_UPDATED:  'workspace:taskUpdated',
  WS_MESSAGE:       'workspace:message',
  WS_ACTIVITY:      'workspace:activity',
  // Server → client
  WS_JOINED:         'workspace:joined',
  WS_MEMBER_JOINED:  'workspace:memberJoined',
  WS_MEMBER_LEFT:    'workspace:memberLeft',
  WS_NEW_MESSAGE:    'workspace:newMessage',

  // ─── Live Sessions ────────────────────────────────────────────────────────────
  SESSION_JOIN:     'session:join',
  SESSION_LEAVE:    'session:leave',
  SESSION_MESSAGE:  'session:message',
  SESSION_SET_LIVE: 'session:setLive',
  SESSION_ANNOUNCE: 'session:announce',
  SESSION_HISTORY:  'session:history',
  // Server → client
  SESSION_JOINED:              'session:joined',
  SESSION_PARTICIPANT_JOINED:  'session:participantJoined',
  SESSION_PARTICIPANT_LEFT:    'session:participantLeft',
  SESSION_NEW_MESSAGE:         'session:newMessage',
  SESSION_STATUS_CHANGED:      'session:statusChanged',
  SESSION_ANNOUNCEMENT:        'session:announcement',

  // ─── Notifications ────────────────────────────────────────────────────────────
  NOTIF_JOIN:          'notification:join',
  NOTIF_MARK_READ:     'notification:markRead',
  NOTIF_MARK_ALL_READ: 'notification:markAllRead',
  // Server → client
  NOTIF_NEW:           'notification:new',
  NOTIF_UNREAD_COUNT:  'notification:unreadCount',
  NOTIF_ALL_READ:      'notification:allRead',
  NOTIF_ANNOUNCEMENT:  'notification:announcement',

  // ─── Presence ─────────────────────────────────────────────────────────────────
  PRESENCE_SET_STATUS: 'presence:setStatus',
  PRESENCE_GET_ONLINE: 'presence:getOnline',
  // Server → client
  PRESENCE_ONLINE:         'presence:online',
  PRESENCE_OFFLINE:        'presence:offline',
  PRESENCE_STATUS_CHANGED: 'presence:statusChanged',
  PRESENCE_ONLINE_USERS:   'presence:onlineUsers',

  // ─── Typing ───────────────────────────────────────────────────────────────────
  TYPING_START: 'typing:start',
  TYPING_STOP:  'typing:stop',
  // Server → client
  TYPING_STARTED: 'typing:started',
  TYPING_STOPPED: 'typing:stopped',

  // ─── Activity Feed ────────────────────────────────────────────────────────────
  ACTIVITY_SUBSCRIBE:   'activity:subscribe',
  ACTIVITY_UNSUBSCRIBE: 'activity:unsubscribe',
  ACTIVITY_GET_RECENT:  'activity:getRecent',
  // Server → client
  ACTIVITY_NEW:    'activity:new',
  ACTIVITY_RECENT: 'activity:recent',
};

module.exports = { EVENTS };
