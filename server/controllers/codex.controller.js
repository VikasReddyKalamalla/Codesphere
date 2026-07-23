const asyncHandler  = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const codexService = require('../services/codex.service');

const getAllProjects   = asyncHandler(async (req, res) => successResponse(res, 200, 'Codex projects fetched', await codexService.getAllProjects(req.query)));
const getProjectById   = asyncHandler(async (req, res) => successResponse(res, 200, 'Codex project fetched', await codexService.getProjectById(req.params.id)));
const createProject    = asyncHandler(async (req, res) => successResponse(res, 201, 'Codex project created', await codexService.createProject(req.body)));
const updateProject    = asyncHandler(async (req, res) => successResponse(res, 200, 'Codex project updated', await codexService.updateProject(req.params.id, req.body)));
const deleteProject    = asyncHandler(async (req, res) => { await codexService.deleteProject(req.params.id); return successResponse(res, 200, 'Codex project deleted'); });

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject };
