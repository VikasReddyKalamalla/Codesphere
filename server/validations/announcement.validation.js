// ─── Announcement Validation Rules ───────────────────────────────────────────

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
const TARGET_AUDIENCES = ['All', 'Students', 'Instructors'];

const createAnnouncementRules = {
  title:          { required: true,  type: 'string', maxLength: 200 },
  message:        { required: true,  type: 'string', maxLength: 2000 },
  priority:       { required: false, type: 'string', enum: PRIORITIES },
  icon:           { required: false, type: 'string', maxLength: 100 },
  targetAudience: { required: false, type: 'string', enum: TARGET_AUDIENCES },
  scheduledAt:    { required: false, type: 'date' },
};

const updateAnnouncementRules = {
  title:          { required: false, type: 'string', maxLength: 200 },
  message:        { required: false, type: 'string', maxLength: 2000 },
  priority:       { required: false, type: 'string', enum: PRIORITIES },
  icon:           { required: false, type: 'string', maxLength: 100 },
  targetAudience: { required: false, type: 'string', enum: TARGET_AUDIENCES },
  scheduledAt:    { required: false, type: 'date' },
};

module.exports = {
  createAnnouncementRules,
  updateAnnouncementRules,
};
