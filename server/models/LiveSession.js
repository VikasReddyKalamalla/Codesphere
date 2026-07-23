const mongoose = require('mongoose');

const liveSessionSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Title is required'],
      trim:      true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    agenda: {
      type:      String,
      default:   '',
      maxlength: [3000, 'Agenda cannot exceed 3000 characters'],
    },
    thumbnail:  { type: String, default: '' },

    // ─── Classification ───────────────────────────────────────────────────────
    category:   { type: String, default: 'General', trim: true },
    difficulty: {
      type:    String,
      enum:    ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    tags:       [{ type: String, trim: true, lowercase: true }],
    language:   { type: String, default: 'English' },

    // ─── Host ─────────────────────────────────────────────────────────────────
    host: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Host is required'],
    },
    coHost: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'User',
      default: null,
    },

    // ─── Community Link ───────────────────────────────────────────────────────
    community: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Community',
      default: null,
    },

    // ─── Scheduling ───────────────────────────────────────────────────────────
    startTime:    { type: Date, required: [true, 'Start time is required'] },
    endTime:      { type: Date, required: [true, 'End time is required'] },
    duration:     { type: Number, default: 0 },  // minutes (auto-calculated)
    timezone:     { type: String, default: 'UTC' },

    // ─── Meeting ──────────────────────────────────────────────────────────────
    meetingLink:    { type: String, default: '' },
    recordingLink:  { type: String, default: '' },

    // ─── Registration ─────────────────────────────────────────────────────────
    maxCapacity:       { type: Number, default: 100 },
    registeredCount:   { type: Number, default: 0 },
    isWaitlistEnabled: { type: Boolean, default: false },

    // ─── Access ───────────────────────────────────────────────────────────────
    isPremium:    { type: Boolean, default: false },
    isPublished:  { type: Boolean, default: false },

    // ─── Status ───────────────────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['draft', 'upcoming', 'live', 'completed', 'cancelled', 'archived'],
      default: 'draft',
    },

    // ─── Stats ────────────────────────────────────────────────────────────────
    viewCount:     { type: Number, default: 0 },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalFeedback: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Auto-calculate duration before save ──────────────────────────────────────
liveSessionSchema.pre('save', function () {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / 60000);
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
liveSessionSchema.index({ host: 1 });
liveSessionSchema.index({ status: 1 });
liveSessionSchema.index({ startTime: 1 });
liveSessionSchema.index({ community: 1 });
liveSessionSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('LiveSession', liveSessionSchema);
