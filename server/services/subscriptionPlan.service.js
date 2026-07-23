const SubscriptionPlan = require('../models/SubscriptionPlan');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getAllPlans = async () => {
  return SubscriptionPlan.find({ isActive: true }).sort({ sortOrder: 1 });
};

const getPlanById = async (id) => {
  const plan = await SubscriptionPlan.findById(id);
  if (!plan) throw createError('Plan not found', 404);
  return plan;
};

const createPlan = async (body) => {
  const { name } = body;
  if (!name) throw createError('Plan name is required', 400);

  const existing = await SubscriptionPlan.findOne({ name });
  if (existing) throw createError('Plan already exists', 409);

  return SubscriptionPlan.create(body);
};

const updatePlan = async (id, body) => {
  const plan = await SubscriptionPlan.findById(id);
  if (!plan) throw createError('Plan not found', 404);

  delete body.name; // prevent changing plan name

  return SubscriptionPlan.findByIdAndUpdate(id, body, { new: true, runValidators: true });
};

const deletePlan = async (id) => {
  const plan = await SubscriptionPlan.findById(id);
  if (!plan) throw createError('Plan not found', 404);

  plan.isActive = false;
  await plan.save();
};

module.exports = { getAllPlans, getPlanById, createPlan, updatePlan, deletePlan };
