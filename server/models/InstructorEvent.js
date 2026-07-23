const mongoose = require('mongoose');

const instructorEventSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    // Aggregated statistics for this event
    totalRegistrations: {
      type: Number,
      default: 0,
    },
    totalAttendees: {
      type: Number,
      default: 0,
    },
    certificatesIssued: {
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
  },
  {
    timestamps: true,
  }
);

instructorEventSchema.index({ instructor: 1, event: 1 }, { unique: true });

const InstructorEvent = mongoose.model('InstructorEvent', instructorEventSchema);

module.exports = InstructorEvent;
