import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../../socket/socket.js';
import { 
  setChatMessages, 
  addChatMessage, 
  updateChatMessage, 
  deleteChatMessage 
} from '../redux/communitySlice.js';
import { selectChatMessages } from '../redux/communitySelectors.js';
import { selectCurrentUser } from '@features/auth/redux/authSelectors.js';

export const useCommunityChat = (communityId) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector(selectChatMessages);
  
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!communityId) return;

    // Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // Join room
    socket.emit('chat:join', { communityId });

    // Listeners
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onJoined = ({ roomKey, users, history }) => {
      dispatch(setChatMessages(history || []));
      setOnlineUsers(users || []);
    };

    const onUserJoined = ({ user }) => {
      setOnlineUsers(prev => {
        if (prev.some(u => u._id === user._id)) return prev;
        return [...prev, user];
      });
    };

    const onUserLeft = ({ userId }) => {
      setOnlineUsers(prev => prev.filter(u => u._id !== userId));
      setTypingUsers(prev => prev.filter(u => u._id !== userId));
    };

    const onNewMessage = ({ message }) => {
      dispatch(addChatMessage(message));
    };

    const onMessageEdited = ({ message }) => {
      dispatch(updateChatMessage(message));
    };

    const onMessageDeleted = ({ messageId }) => {
      dispatch(deleteChatMessage(messageId));
    };

    const onTyping = ({ user }) => {
      if (user._id === currentUser?._id) return;
      setTypingUsers(prev => {
        if (prev.some(u => u._id === user._id)) return prev;
        return [...prev, user];
      });
    };

    const onStopTyping = ({ userId }) => {
      setTypingUsers(prev => prev.filter(u => u._id !== userId));
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('chat:joined', onJoined);
    socket.on('chat:userJoined', onUserJoined);
    socket.on('chat:userLeft', onUserLeft);
    socket.on('chat:newMessage', onNewMessage);
    socket.on('chat:messageEdited', onMessageEdited);
    socket.on('chat:messageDeleted', onMessageDeleted);
    socket.on('chat:typing', onTyping);
    socket.on('chat:stopTyping', onStopTyping);

    return () => {
      socket.emit('chat:leave', { communityId });
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('chat:joined', onJoined);
      socket.off('chat:userJoined', onUserJoined);
      socket.off('chat:userLeft', onUserLeft);
      socket.off('chat:newMessage', onNewMessage);
      socket.off('chat:messageEdited', onMessageEdited);
      socket.off('chat:messageDeleted', onMessageDeleted);
      socket.off('chat:typing', onTyping);
      socket.off('chat:stopTyping', onStopTyping);
    };
  }, [communityId, dispatch, currentUser?._id]);

  const sendMessage = (content) => {
    if (!content.trim()) return;
    socket.emit('chat:message', { communityId, content });
    sendStopTyping();
  };

  const sendTyping = () => {
    socket.emit('chat:typing', { communityId });
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendStopTyping();
    }, 3000);
  };

  const sendStopTyping = () => {
    socket.emit('chat:stopTyping', { communityId });
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  return {
    messages,
    onlineUsers,
    typingUsers,
    isConnected,
    sendMessage,
    sendTyping
  };
};
