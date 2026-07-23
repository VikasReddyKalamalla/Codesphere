// ─── Notification Log Validation Rules ───────────────────────────────────────

const DELIVERY_STATUSES = ['Pending', 'Delivered', 'Failed', 'Skipped'];
const READ_STATUSES = ['Unread', 'Read'];

const getLogsRules = {
  deliveryStatus: { required: false, type: 'string', enum: DELIVERY_STATUSES },
  readStatus:     { required: false, type: 'string', enum: READ_STATUSES },
  recipient:      { required: false, type: 'objectId' },
  page:           { required: false, type: 'number', min: 1 },
  limit:          { required: false, type: 'number', min: 1, max: 100 },
};

module.exports = { getLogsRules };
