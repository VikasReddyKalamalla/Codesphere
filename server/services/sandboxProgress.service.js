const SandboxProgress = require('../models/SandboxProgress');
const SandboxProject  = require('../models/SandboxProject');
const SandboxStep     = require('../models/SandboxStep');
const { syncDbToDisk } = require('../utils/workspaceSync');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET OR CREATE PROGRESS ───────────────────────────────────────────────────
const getProgress = async (projectId, userId) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  let progress = await SandboxProgress.findOne({ projectId, userId });

  if (!progress) {
    // Auto-create progress record on first access
    progress = await SandboxProgress.create({
      projectId,
      userId,
      totalSteps: project.stepCount,
      status: 'not_started',
    });
  }

  return progress;
};

// ─── START PROJECT (enroll) ──────────────────────────────────────────────────
const startProject = async (projectId, userId) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  if (!project.isPublished) throw createError('Cannot enroll in an unpublished project', 400);

  // Find or create progress
  let progress = await SandboxProgress.findOne({ projectId, userId });

  if (progress && progress.status !== 'not_started') {
    throw createError('You have already started this project', 409);
  }

  if (!progress) {
    progress = await SandboxProgress.create({
      projectId,
      userId,
      totalSteps: project.stepCount,
      status: 'in_progress',
      startedAt: new Date(),
    });

    // Increment project enrolled count
    await SandboxProject.findByIdAndUpdate(projectId, { $inc: { enrolledCount: 1 } });
  } else {
    progress.status    = 'in_progress';
    progress.startedAt = new Date();
    await progress.save();

    await SandboxProject.findByIdAndUpdate(projectId, { $inc: { enrolledCount: 1 } });
  }

  return progress;
};

// ─── UPDATE PROGRESS (complete a step) ──────────────────────────────────────
const updateProgress = async (projectId, userId, body) => {
  const { stepNumber, codeFiles, unmark } = body;

  const progress = await SandboxProgress.findOne({ projectId, userId });
  if (!progress) throw createError('Progress not found. Start the project first.', 404);

  if (codeFiles) {
    progress.codeFiles = codeFiles;
    progress.markModified('codeFiles');
  }

  if (stepNumber) {
    if (unmark) {
      // Remove step from completedSteps
      const idx = progress.completedSteps.indexOf(stepNumber);
      if (idx > -1) {
        progress.completedSteps.splice(idx, 1);
      }

      // Calculate completion percentage
      progress.completionPercent = progress.totalSteps > 0
        ? Math.round((progress.completedSteps.length / progress.totalSteps) * 100)
        : 0;

      // Move currentStep back if needed
      if (progress.currentStep > stepNumber) {
        progress.currentStep = stepNumber;
      }

      // Revert status to in_progress if it was completed
      if (progress.status === 'completed') {
        progress.status = 'in_progress';
        progress.completedAt = null;

        // Decrement project completed count
        await SandboxProject.findByIdAndUpdate(projectId, { $inc: { completedCount: -1 } });
      }
    } else {
      // Mark step as completed if not already
      if (!progress.completedSteps.includes(stepNumber)) {
        progress.completedSteps.push(stepNumber);

        const { recordUserActivity } = require('./activity.service');
        recordUserActivity(userId, {
          module: 'Codex',
          action: 'completed_sandbox_step',
          referenceId: projectId,
        }).catch(() => {});

        // Calculate completion percentage
        progress.completionPercent = progress.totalSteps > 0
          ? Math.round((progress.completedSteps.length / progress.totalSteps) * 100)
          : 0;

        // Move to next step if current
        if (stepNumber === progress.currentStep) {
          progress.currentStep = stepNumber + 1;
        }

        // Mark as completed if all steps done
        if (progress.completedSteps.length >= progress.totalSteps) {
          progress.status = 'completed';
          progress.completedAt = new Date();

          // Increment project completed count
          await SandboxProject.findByIdAndUpdate(projectId, { $inc: { completedCount: 1 } });
        }
      }
    }
  }

  await progress.save();
  if (codeFiles) {
    try {
      await syncDbToDisk(projectId, userId);
    } catch (err) {
      console.warn('Failed to sync updated codeFiles to disk:', err.message);
    }
  }
  return progress;
};

// ─── RESET PROGRESS ───────────────────────────────────────────────────────────
const resetProgress = async (projectId, userId) => {
  const progress = await SandboxProgress.findOne({ projectId, userId });
  if (!progress) throw createError('Progress not found', 404);

  // Decrement completed count if user had completed it
  if (progress.status === 'completed') {
    await SandboxProject.findByIdAndUpdate(projectId, { $inc: { completedCount: -1 } });
  }

  progress.currentStep       = 1;
  progress.completedSteps    = [];
  progress.completionPercent = 0;
  progress.codeFiles         = null;
  progress.status            = 'in_progress';
  progress.startedAt         = new Date();
  progress.completedAt       = null;
  progress.timeSpent         = 0;
  await progress.save();

  return progress;
};

// ─── GET MY PROGRESS (all enrolled projects) ─────────────────────────────────
const getMyProgress = async (userId, query) => {
  const { status } = query;

  const filter = { userId };
  if (status) filter.status = status;

  return SandboxProgress.find(filter)
    .populate({
      path:   'projectId',
      select: 'title description thumbnail difficulty category technologyStack instructor',
      populate: { path: 'instructor', select: 'fullName avatar' },
    })
    .sort({ updatedAt: -1 });
};

module.exports = { getProgress, startProject, updateProgress, resetProgress, getMyProgress };
