const mongoose = require('mongoose');

const instructorStudentSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The course (learning path) through which this relationship was formed
    learningPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
    },
    // Aggregated student metrics visible to the instructor
    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completedLessons: {
      type: Number,
      default: 0,
    },
    completedAssessments: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    attendedSessions: {
      type: Number,
      default: 0,
    },
    completedSandboxes: {
      type: Number,
      default: 0,
    },
    lastActiveAt: {
      type: Date,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

instructorStudentSchema.index({ instructor: 1, student: 1 }, { unique: true });

const InstructorStudent = mongoose.model('InstructorStudent', instructorStudentSchema);

module.exports = InstructorStudent;
