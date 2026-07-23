// Bookmarks are created via URL params only — no request body needed.
const bookmarkRules = {
  resourceId: { required: true, source: 'params', type: 'ObjectId' },
};

module.exports = { bookmarkRules };
