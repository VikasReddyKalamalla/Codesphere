const asyncHandler           = require('../utils/asyncHandler');
const { successResponse }    = require('../utils/apiResponse');
const subscriptionPlanService = require('../services/subscriptionPlan.service');

const getAllPlans = asyncHandler(async (req, res) => successResponse(res, 200, 'Plans fetched successfully', await subscriptionPlanService.getAllPlans()));
const getPlanById = asyncHandler(async (req, res) => successResponse(res, 200, 'Plan fetched successfully', await subscriptionPlanService.getPlanById(req.params.id)));
const createPlan  = asyncHandler(async (req, res) => successResponse(res, 201, 'Plan created successfully', await subscriptionPlanService.createPlan(req.body)));
const updatePlan  = asyncHandler(async (req, res) => successResponse(res, 200, 'Plan updated successfully', await subscriptionPlanService.updatePlan(req.params.id, req.body)));
const deletePlan  = asyncHandler(async (req, res) => { await subscriptionPlanService.deletePlan(req.params.id); return successResponse(res, 200, 'Plan deleted successfully'); });

module.exports = { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan };
