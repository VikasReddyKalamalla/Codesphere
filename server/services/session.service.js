const Session = require('../models/Session');

const getAllSessions = async (query) => {
  let sessions = await Session.find().populate('host', 'fullName avatar').populate('community', 'name').catch(() => []);
  if (!sessions || sessions.length === 0) {
    const { autoSeedIfEmpty } = require('../utils/autoSeed');
    await autoSeedIfEmpty().catch(() => {});
    sessions = await Session.find().populate('host', 'fullName avatar').populate('community', 'name').catch(() => []);
  }
  return sessions;
};
const getSessionById = async (id) => Session.findById(id).populate('host').populate('participants', 'fullName avatar');
const createSession  = async (data, userId) => Session.create({ ...data, host: userId });
const updateSession  = async (id, data) => Session.findByIdAndUpdate(id, data, { new: true });
const deleteSession  = async (id) => Session.findByIdAndDelete(id);

module.exports = { getAllSessions, getSessionById, createSession, updateSession, deleteSession };
