const Session = require('../models/Session');

const getAllSessions = async (query) => Session.find().populate('host', 'fullName avatar').populate('community', 'name');
const getSessionById = async (id) => Session.findById(id).populate('host').populate('participants', 'fullName avatar');
const createSession  = async (data, userId) => Session.create({ ...data, host: userId });
const updateSession  = async (id, data) => Session.findByIdAndUpdate(id, data, { new: true });
const deleteSession  = async (id) => Session.findByIdAndDelete(id);

module.exports = { getAllSessions, getSessionById, createSession, updateSession, deleteSession };
