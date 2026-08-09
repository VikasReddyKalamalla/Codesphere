const mongoose = require('mongoose');

const sessionRequestSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, maxlength: 2000 },
    agenda: { type: String, default: '', maxlength: 3000 },
    proposedTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    adminNotes: { type: String, default: '' },
    liveSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveSession', default: null }, // Linked when approved
  },
  { timestamps: true }
);

module.exports = mongoose.model('SessionRequest', sessionRequestSchema);
