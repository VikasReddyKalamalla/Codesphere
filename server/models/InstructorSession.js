const mongoose = require('mongoose');

const instructorSessionSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LiveSession',
      required: true,
      index: true,
    },
    // Aggregated statistics for this session
    totalRegistrations: {
      type: Number,
      default: 0,
    },
    totalAttendees: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    durationMinutes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

instructorSessionSchema.index({ instructor: 1, session: 1 }, { unique: true });

const InstructorSession = mongoose.model('InstructorSession', instructorSessionSchema);

module.exports = InstructorSession;
