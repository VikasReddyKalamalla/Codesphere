const asyncHandler  = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const sessionService = require('../services/session.service');

const getAllSessions   = asyncHandler(async (req, res) => successResponse(res, 200, 'Sessions fetched', await sessionService.getAllSessions(req.query)));
const getSessionById   = asyncHandler(async (req, res) => successResponse(res, 200, 'Session fetched', await sessionService.getSessionById(req.params.id)));
const createSession    = asyncHandler(async (req, res) => successResponse(res, 201, 'Session created', await sessionService.createSession(req.body, req.user._id)));
const updateSession    = asyncHandler(async (req, res) => successResponse(res, 200, 'Session updated', await sessionService.updateSession(req.params.id, req.body)));
const deleteSession    = asyncHandler(async (req, res) => { await sessionService.deleteSession(req.params.id); return successResponse(res, 200, 'Session deleted'); });

module.exports = { getAllSessions, getSessionById, createSession, updateSession, deleteSession };
