const mongoose = require('mongoose');

const instructorCourseSchema = new mongoose.Schema(
  {
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Instructor',
      required: true,
      index: true,
    },
    learningPath: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
      required: true,
      index: true,
    },
    // Aggregated statistics for this course
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    activeEnrollments: {
      type: Number,
      default: 0,
    },
    completions: {
      type: Number,
      default: 0,
    },
    averageProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
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
    revenue: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

instructorCourseSchema.index({ instructor: 1, learningPath: 1 }, { unique: true });

const InstructorCourse = mongoose.model('InstructorCourse', instructorCourseSchema);

module.exports = InstructorCourse;
