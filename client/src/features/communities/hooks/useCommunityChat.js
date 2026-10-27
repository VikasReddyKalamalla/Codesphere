import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket/socket.js';
import {
  setChatMessages,
  prependChatMessages,
  addChatMessage,
  updateChatMessage,
  deleteChatMessage,
  updateDeliveryStatus,
  updateReactions,
} from '../redux/communitySlice.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const useCommunityChat = ({
  communityId,
  channelId,
  directChatId,
  mode = 'community', // 'community' | 'direct'
}) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector((state) => state.communities.chatMessages || []);

  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const typingTimeoutRef = useRef(null);

  // Compute active room key
  const roomKey = mode === 'direct' && directChatId
    ? `direct:${directChatId}`
    : channelId
    ? `channel:${channelId}`
    : communityId
    ? `community:${communityId}`
    : null;

  useEffect(() => {
    if (!roomKey) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Join room based on mode
    if (mode === 'direct' && directChatId) {
      socket.emit('direct:join', { directChatId });
    } else if (channelId) {
      socket.emit('channel:join', { channelId, communityId });
    } else if (communityId) {
      socket.emit('chat:join', { communityId });
    }

    // ─── Socket Event Listeners ───────────────────────────────────────────────
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onChannelJoined = ({ roomKey: rKey, users, history }) => {
      if (rKey === roomKey) {
        dispatch(setChatMessages(history || []));
        setOnlineUsers(users || []);
        // Auto-ack delivery & read for initial history
        history?.forEach((m) => {
          if (m.sender?._id !== currentUser?._id) {
            socket.emit('message:read_ack', { messageId: m._id, roomKey });
          }
        });
      }
    };

    const onDirectJoined = ({ roomKey: rKey, history }) => {
      if (rKey === roomKey) {
        dispatch(setChatMessages(history || []));
        history?.forEach((m) => {
          if (m.sender?._id !== currentUser?._id) {
            socket.emit('message:read_ack', { messageId: m._id, roomKey });
          }
        });
      }
    };

    const onLegacyJoined = ({ roomKey: rKey, users, history }) => {
      if (rKey === roomKey) {
        dispatch(setChatMessages(history || []));
        setOnlineUsers(users || []);
      }
    };

    const onUserJoined = ({ roomKey: rKey, user }) => {
      if (!rKey || rKey === roomKey) {
        setOnlineUsers((prev) => {
          if (prev.some((u) => u._id === user._id)) return prev;
          return [...prev, user];
        });
      }
    };

    const onUserLeft = ({ roomKey: rKey, userId }) => {
      if (!rKey || rKey === roomKey) {
        setOnlineUsers((prev) => prev.filter((u) => u._id !== userId));
        setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    };

    const onNewMessage = ({ roomKey: rKey, message }) => {
      if (rKey === roomKey) {
        dispatch(addChatMessage(message));
        // If not sent by me, acknowledge read
        if (message.sender?._id !== currentUser?._id) {
          socket.emit('message:read_ack', { messageId: message._id, roomKey });
        }
      }
    };

    const onDeliveryUpdated = ({ messageId, deliveryStatus }) => {
      dispatch(updateDeliveryStatus({ messageId, deliveryStatus }));
    };

    const onReadUpdated = ({ messageId, deliveryStatus }) => {
      dispatch(updateDeliveryStatus({ messageId, deliveryStatus }));
    };

    const onReacted = ({ messageId, reactions }) => {
      dispatch(updateReactions({ messageId, reactions }));
    };

    const onMessageEdited = ({ message }) => {
      dispatch(updateChatMessage(message));
    };

    const onMessageDeleted = ({ messageId }) => {
      dispatch(deleteChatMessage(messageId));
    };

    const onTyping = ({ roomKey: rKey, user }) => {
      if (rKey === roomKey && user._id !== currentUser?._id) {
        setTypingUsers((prev) => {
          if (prev.some((u) => u._id === user._id)) return prev;
          return [...prev, user];
        });
      }
    };

    const onStopTyping = ({ roomKey: rKey, userId }) => {
      if (rKey === roomKey) {
        setTypingUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    };

    const onHistory = ({ roomKey: rKey, messages: olderMessages, hasMore: more }) => {
      if (rKey === roomKey) {
        dispatch(prependChatMessages(olderMessages));
        setHasMore(more);
        setLoadingOlder(false);
      }
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('channel:joined', onChannelJoined);
    socket.on('direct:joined', onDirectJoined);
    socket.on('chat:joined', onLegacyJoined);
    socket.on('chat:userJoined', onUserJoined);
    socket.on('chat:userLeft', onUserLeft);
    socket.on('chat:newMessage', onNewMessage);
    socket.on('message:deliveryUpdated', onDeliveryUpdated);
    socket.on('message:readUpdated', onReadUpdated);
    socket.on('chat:reacted', onReacted);
    socket.on('chat:messageEdited', onMessageEdited);
    socket.on('chat:messageDeleted', onMessageDeleted);
    socket.on('chat:typing', onTyping);
    socket.on('chat:stopTyping', onStopTyping);
    socket.on('chat:history', onHistory);

    return () => {
      if (mode === 'direct' && directChatId) {
        socket.emit('direct:leave', { directChatId });
      } else if (channelId) {
        socket.emit('channel:leave', { channelId });
      } else if (communityId) {
        socket.emit('chat:leave', { communityId });
      }

      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('channel:joined', onChannelJoined);
      socket.off('direct:joined', onDirectJoined);
      socket.off('chat:joined', onLegacyJoined);
      socket.off('chat:userJoined', onUserJoined);
      socket.off('chat:userLeft', onUserLeft);
      socket.off('chat:newMessage', onNewMessage);
      socket.off('message:deliveryUpdated', onDeliveryUpdated);
      socket.off('message:readUpdated', onReadUpdated);
      socket.off('chat:reacted', onReacted);
      socket.off('chat:messageEdited', onMessageEdited);
      socket.off('chat:messageDeleted', onMessageDeleted);
      socket.off('chat:typing', onTyping);
      socket.off('chat:stopTyping', onStopTyping);
      socket.off('chat:history', onHistory);
    };
  }, [roomKey, mode, channelId, directChatId, communityId, dispatch, currentUser?._id]);

  // ─── Actions ───────────────────────────────────────────────────────────────

  const sendMessage = useCallback(
    ({ content, type = 'text', codeSnippet, attachments, replyTo }) => {
      if (!content?.trim() && (!codeSnippet || !codeSnippet.code)) return;

      if (mode === 'direct' && directChatId) {
        socket.emit('direct:message', {
          directChatId,
          content,
          type,
          codeSnippet,
          attachments,
          replyTo,
        });
      } else if (channelId) {
        socket.emit('channel:message', {
          channelId,
          communityId,
          content,
          type,
          codeSnippet,
          attachments,
          replyTo,
        });
      } else if (communityId) {
        socket.emit('chat:message', { communityId, content, replyTo });
      }

      sendStopTyping();
    },
    [mode, directChatId, channelId, communityId]
  );

  const sendTyping = useCallback(() => {
    if (!roomKey) return;
    socket.emit('chat:typing', { roomKey });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping();
    }, 3000);
  }, [roomKey]);

  const sendStopTyping = useCallback(() => {
    if (!roomKey) return;
    socket.emit('chat:stopTyping', { roomKey });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [roomKey]);

  const sendReaction = useCallback(
    (messageId, emoji) => {
      if (!roomKey) return;
      socket.emit('chat:react', { messageId, roomKey, emoji });
    },
    [roomKey]
  );

  const sendPin = useCallback(
    (messageId, pin = true) => {
      if (!roomKey) return;
      socket.emit('chat:pin', { messageId, roomKey, pin });
    },
    [roomKey]
  );

  const loadOlderMessages = useCallback(() => {
    if (!roomKey || loadingOlder || !hasMore || messages.length === 0) return;
    const earliestId = messages[0]._id;
    setLoadingOlder(true);
    socket.emit('chat:history', { roomKey, before: earliestId, limit: 30 });
  }, [roomKey, loadingOlder, hasMore, messages]);

  return {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    loadingOlder,
    hasMore,
    roomKey,
    sendMessage,
    sendTyping,
    sendReaction,
    sendPin,
    loadOlderMessages,
  };
};
