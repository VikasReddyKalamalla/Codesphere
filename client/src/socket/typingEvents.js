import { socket } from './socket.js';
export const emitTyping = (roomId, isTyping) => socket.emit('typing_status', { roomId, isTyping });
