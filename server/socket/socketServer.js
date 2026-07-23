/**
 * socketServer.js — re-exports the core socket init/getIO utilities.
 *
 * This is a convenience alias that matches the spec folder structure.
 * All real logic lives in socket.js.
 */
const { initSocket, getIO } = require('./socket');

module.exports = { initSocket, getIO };
