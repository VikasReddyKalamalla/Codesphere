// ─── Workspace Member Validation Rules ────────────────────────────────────────

const inviteMemberRules = {
  userId: { required: true,  type: 'objectId' },
  role:   { required: false, type: 'string', enum: ['admin', 'member'] },
};

const transferOwnershipRules = {
  newOwnerId: { required: true, type: 'objectId' },
};

module.exports = { inviteMemberRules, transferOwnershipRules };
