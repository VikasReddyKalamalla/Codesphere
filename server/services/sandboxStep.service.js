const SandboxStep    = require('../models/SandboxStep');
const SandboxProject = require('../models/SandboxProject');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ASSERT INSTRUCTOR ACCESS ─────────────────────────────────────────────────
const assertInstructor = async (projectId, userId, userRole) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);
  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('Only the project instructor can manage steps', 403);
  }
  return project;
};

// ─── GET STEPS FOR PROJECT ────────────────────────────────────────────────────
const getProjectSteps = async (projectId) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  return SandboxStep.find({ projectId }).sort({ stepNumber: 1 });
};

// ─── GET STEP BY ID ───────────────────────────────────────────────────────────
const getStepById = async (stepId) => {
  const step = await SandboxStep.findById(stepId);
  if (!step) throw createError('Step not found', 404);
  return step;
};

// ─── CREATE STEP ──────────────────────────────────────────────────────────────
const createStep = async (body, userId, userRole) => {
  const { projectId, title, stepNumber } = body;

  if (!projectId)   throw createError('Project ID is required', 400);
  if (!title)       throw createError('Step title is required', 400);
  if (!stepNumber)  throw createError('Step number is required', 400);

  await assertInstructor(projectId, userId, userRole);

  // Prevent duplicate step numbers
  const duplicate = await SandboxStep.findOne({ projectId, stepNumber });
  if (duplicate) throw createError(`Step number ${stepNumber} already exists in this project`, 409);

  const step = await SandboxStep.create(body);

  // Increment project step count
  await SandboxProject.findByIdAndUpdate(projectId, { $inc: { stepCount: 1 } });

  return step;
};

// ─── UPDATE STEP ──────────────────────────────────────────────────────────────
const updateStep = async (stepId, body, userId, userRole) => {
  const step = await SandboxStep.findById(stepId);
  if (!step) throw createError('Step not found', 404);

  await assertInstructor(step.projectId, userId, userRole);

  // Prevent duplicate step numbers on renumber
  if (body.stepNumber && body.stepNumber !== step.stepNumber) {
    const duplicate = await SandboxStep.findOne({ projectId: step.projectId, stepNumber: body.stepNumber });
    if (duplicate) throw createError(`Step number ${body.stepNumber} already exists in this project`, 409);
  }

  return SandboxStep.findByIdAndUpdate(stepId, body, { new: true, runValidators: true });
};

// ─── DELETE STEP ──────────────────────────────────────────────────────────────
const deleteStep = async (stepId, userId, userRole) => {
  const step = await SandboxStep.findById(stepId);
  if (!step) throw createError('Step not found', 404);

  await assertInstructor(step.projectId, userId, userRole);

  await step.deleteOne();

  // Decrement project step count
  await SandboxProject.findByIdAndUpdate(step.projectId, { $inc: { stepCount: -1 } });
};

// ─── REORDER STEPS ───────────────────────────────────────────────────────────
const reorderSteps = async (projectId, orderedIds, userId, userRole) => {
  await assertInstructor(projectId, userId, userRole);

  const updates = orderedIds.map((id, index) =>
    SandboxStep.findByIdAndUpdate(id, { stepNumber: index + 1 })
  );

  await Promise.all(updates);

  return SandboxStep.find({ projectId }).sort({ stepNumber: 1 });
};

module.exports = { getProjectSteps, getStepById, createStep, updateStep, deleteStep, reorderSteps };
