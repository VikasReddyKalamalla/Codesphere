import { socket } from './socket.js';
export const joinCommunityRoom = (roomId) => socket.emit('join_community', { roomId });
export const sendCommunityMessage = (roomId, msg) => socket.emit('msg_community', { roomId, msg });
