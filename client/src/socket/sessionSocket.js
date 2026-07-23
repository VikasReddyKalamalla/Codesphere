import { socket } from './socket.js';
export const emitMeetingOffer = (payload) => socket.emit('meeting_offer', payload);
