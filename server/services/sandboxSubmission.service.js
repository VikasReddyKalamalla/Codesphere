const SandboxSubmission = require('../models/SandboxSubmission');
const SandboxProject    = require('../models/SandboxProject');
const { getPagination }  = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── SUBMIT PROJECT ───────────────────────────────────────────────────────────
const submitProject = async (projectId, body, userId) => {
  const { submissionType, githubUrl, zipFileUrl, liveDemoUrl, notes } = body;

  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  // Validate submission type and URL
  if (submissionType === 'github' && !githubUrl) {
    throw createError('GitHub URL is required for GitHub submissions', 400);
  }
  if (submissionType === 'zip' && !zipFileUrl) {
    throw createError('ZIP file URL is required for ZIP submissions', 400);
  }
  if (submissionType === 'live_demo' && !liveDemoUrl) {
    throw createError('Live demo URL is required for live demo submissions', 400);
  }

  // Check for existing submission
  let submission = await SandboxSubmission.findOne({ projectId, userId });

  if (submission) {
    // Update existing submission
    submission.submissionType = submissionType;
    submission.githubUrl      = githubUrl || '';
    submission.zipFileUrl     = zipFileUrl || '';
    submission.liveDemoUrl    = liveDemoUrl || '';
    submission.notes          = notes || '';
    submission.status         = 'pending';
    submission.submittedAt    = new Date();
    await submission.save();
  } else {
    // Create new submission
    submission = await SandboxSubmission.create({
      projectId,
      userId,
      submissionType,
      githubUrl:   githubUrl || '',
      zipFileUrl:  zipFileUrl || '',
      liveDemoUrl: liveDemoUrl || '',
      notes:       notes || '',
    });
  }

  return submission;
};

// ─── UPDATE SUBMISSION ────────────────────────────────────────────────────────
const updateSubmission = async (submissionId, body, userId) => {
  const submission = await SandboxSubmission.findById(submissionId);
  if (!submission) throw createError('Submission not found', 404);

  if (submission.userId.toString() !== userId.toString()) {
    throw createError('You can only update your own submissions', 403);
  }

  submission.submissionType = body.submissionType || submission.submissionType;
  submission.githubUrl      = body.githubUrl      || submission.githubUrl;
  submission.zipFileUrl     = body.zipFileUrl     || submission.zipFileUrl;
  submission.liveDemoUrl    = body.liveDemoUrl    || submission.liveDemoUrl;
  submission.notes          = body.notes          || submission.notes;
  submission.status         = 'pending';
  submission.submittedAt    = new Date();
  await submission.save();

  return submission;
};

// ─── DELETE SUBMISSION ────────────────────────────────────────────────────────
const deleteSubmission = async (submissionId, userId, userRole) => {
  const submission = await SandboxSubmission.findById(submissionId);
  if (!submission) throw createError('Submission not found', 404);

  if (submission.userId.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You can only delete your own submissions', 403);
  }

  await submission.deleteOne();
};

// ─── GET SUBMISSIONS FOR PROJECT (instructor/admin) ──────────────────────────
const getProjectSubmissions = async (projectId, userId, userRole, query) => {
  const project = await SandboxProject.findById(projectId);
  if (!project) throw createError('Sandbox project not found', 404);

  // Only instructor or admin can view all submissions
  if (project.instructor.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view submissions for this project', 403);
  }

  const { page = 1, limit = 20, status } = query;

  const filter = { projectId };
  if (status) filter.status = status;

  const total = await SandboxSubmission.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const submissions = await SandboxSubmission.find(filter)
    .populate('userId', 'fullName avatar email')
    .populate('reviewedBy', 'fullName avatar')
    .sort({ submittedAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, submissions };
};

// ─── GET MY SUBMISSIONS ──────────────────────────────────────────────────────
const getMySubmissions = async (userId) => {
  return SandboxSubmission.find({ userId })
    .populate({
      path:   'projectId',
      select: 'title thumbnail instructor',
      populate: { path: 'instructor', select: 'fullName avatar' },
    })
    .populate('reviewedBy', 'fullName avatar')
    .sort({ submittedAt: -1 });
};

// ─── REVIEW SUBMISSION (instructor/admin) ────────────────────────────────────
const reviewSubmission = async (submissionId, reviewData, reviewerId, userRole) => {
  const { status, reviewNotes } = reviewData;

  const submission = await SandboxSubmission.findById(submissionId).populate('projectId');
  if (!submission) throw createError('Submission not found', 404);

  const project = submission.projectId;

  if (project.instructor.toString() !== reviewerId.toString() && userRole !== 'admin') {
    throw createError('Only the project instructor can review submissions', 403);
  }

  if (!['approved', 'rejected'].includes(status)) {
    throw createError('Review status must be either approved or rejected', 400);
  }

  submission.status      = status;
  submission.reviewNotes = reviewNotes || '';
  submission.reviewedBy  = reviewerId;
  submission.reviewedAt  = new Date();
  await submission.save();

  return submission.populate('reviewedBy', 'fullName avatar');
};

module.exports = {
  submitProject,
  updateSubmission,
  deleteSubmission,
  getProjectSubmissions,
  getMySubmissions,
  reviewSubmission,
};
