// ─── Admin Moderation Validation Rules ───────────────────────────────────────

const CONTENT_TYPES = ['Post', 'Comment', 'Community', 'Resource', 'Event', 'User'];
const REASONS = ['spam', 'abuse', 'harassment', 'fake_information', 'inappropriate_content', 'phishing', 'other'];

const createModerationItemRules = {
  contentType:  { required: true,  type: 'string', enum: CONTENT_TYPES },
  contentId:    { required: true,  type: 'objectId' },
  reason:       { required: true,  type: 'string', enum: REASONS },
  description:  { required: false, type: 'string', maxLength: 1000 },
  priority:     { required: false, type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
};

const reviewModerationRules = {
  adminNotes: { required: false, type: 'string', maxLength: 1000 },
};

module.exports = { createModerationItemRules, reviewModerationRules };
