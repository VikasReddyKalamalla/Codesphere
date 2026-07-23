// ─── Task Attachment Validation Rules ─────────────────────────────────────────

const uploadAttachmentRules = {
  fileName: { required: true,  type: 'string', maxLength: 255 },
  fileUrl:  { required: true,  type: 'string' },
  fileType: { required: false, type: 'string' },
  fileSize: { required: false, type: 'number', min: 0 },
};

module.exports = { uploadAttachmentRules };
