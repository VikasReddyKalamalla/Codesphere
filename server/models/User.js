const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // ─── Basic Information ─────────────────────────────────────────────────────
    fullName:  { type: String, required: [true, 'Full name is required'], trim: true },
    username:  {
      type:      String,
      required:  [true, 'Username is required'],
      unique:    true,
      trim:      true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match:     [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      trim:      true,
      lowercase: true,
      match:     [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select:    false, // never returned in queries by default
    },
    phone:    { type: String, default: '', trim: true },
    avatar:   { type: String, default: '' },
    bio:      { type: String, default: '', maxlength: [300, 'Bio cannot exceed 300 characters'] },
    website:  { type: String, default: '' },
    location: { type: String, default: '' },

    // ─── Role ─────────────────────────────────────────────────────────────────
    role: {
      type:    String,
      enum:    { values: ['student', 'instructor', 'admin', 'mentor', 'recruiter', 'organization'], message: '{VALUE} is not a valid role' },
      default: 'student',
    },

    // ─── Subscription Plan ────────────────────────────────────────────────────
    plan: {
      type:    String,
      enum:    { values: ['free', 'standard', 'premium'], message: '{VALUE} is not a valid plan' },
      default: 'free',
    },

    // ─── Learning Progress ────────────────────────────────────────────────────
    dayStreak:         { type: Number, default: 0 },
    achievementPoints: { type: Number, default: 0 },
    learningPaths:     [{ type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath' }],
    bookmarks:         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bookmark' }],
    skills:            [{ type: String, trim: true }],

    // ─── Social ───────────────────────────────────────────────────────────────
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    // ─── Instructor Information ───────────────────────────────────────────────
    isInstructor:      { type: Boolean, default: false },
    applicationStatus: {
      type:    String,
      enum:    ['none', 'pending', 'approved', 'rejected'],
      default: 'none',
    },

    // ─── Account Status & Security ───────────────────────────────────────────
    isVerified: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },

    // ─── 2FA & TOTP Security ──────────────────────────────────────────────────
    twoFactorEnabled:      { type: Boolean, default: false },
    twoFactorSecret:       { type: String, select: false },
    passwordResetToken:    { type: String, select: false },
    passwordResetExpires:  { type: Date, select: false },
    emailVerificationToken:{ type: String, select: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Note: email and username are already indexed via unique:true in the schema fields above.

module.exports = mongoose.model('User', userSchema);
