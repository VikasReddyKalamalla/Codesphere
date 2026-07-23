const mongoose = require('mongoose');

const sessionAttendanceSchema = new mongoose.Schema(
  {
    sessionId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'LiveSession',
      required: true,
    },
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: true,
    },
    joinedAt:   { type: Date, default: null },
    leftAt:     { type: Date, default: null },
    duration:   { type: Number, default: 0 },    // minutes actually attended
    percentage: { type: Number, default: 0 },    // attendance % of total session
    isCompleted:{ type: Boolean, default: false },// attended >= 80%
  },
  { timestamps: true }
);

// One attendance record per user per session
sessionAttendanceSchema.index({ sessionId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('SessionAttendance', sessionAttendanceSchema);
