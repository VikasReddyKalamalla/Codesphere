const bcrypt       = require('bcryptjs');
const generateToken = require('../utils/generateToken');

// Determine which database to use
let User;
const USE_MOCK_DB = process.env.NODE_ENV === 'development';

if (USE_MOCK_DB) {
  console.log('📝 Using in-memory mock database (development mode)');
  User = require('./mockDatabase');
} else {
  try {
    User = require('../models/User');
  } catch (err) {
    console.warn('⚠️  MongoDB not available, falling back to mock database');
    User = require('./mockDatabase');
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Return a safe public user object (no password, no internal flags).
 */
const sanitizeUser = (user) => ({
  _id:               user._id,
  fullName:          user.fullName,
  username:          user.username,
  email:             user.email,
  phone:             user.phone,
  avatar:            user.avatar,
  bio:               user.bio,
  website:           user.website,
  location:          user.location,
  role:              user.role,
  plan:              user.plan,
  isInstructor:      user.isInstructor,
  applicationStatus: user.applicationStatus,
  isVerified:        user.isVerified,
  isActive:          user.isActive,
  dayStreak:         user.dayStreak,
  achievementPoints: user.achievementPoints,
  createdAt:         user.createdAt,
});

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── Register ─────────────────────────────────────────────────────────────────

/**
 * Register a new user.
 * - Validates uniqueness of email and username
 * - Hashes password with bcrypt (salt rounds: 12)
 * - Returns JWT + sanitized user
 */
const register = async ({ fullName, username, email, password }) => {
  // 1. Check required fields
  if (!fullName || !username || !email || !password) {
    throw createError('fullName, username, email and password are required', 400);
  }

  // 2. Check for duplicate email
  const emailExists = await User.findOne({ email: email.toLowerCase() });
  if (emailExists) throw createError('Email is already registered', 409);

  // 3. Check for duplicate username
  const usernameExists = await User.findOne({ username: username.toLowerCase() });
  if (usernameExists) throw createError('Username is already taken', 409);

  // 4. Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 5. Create user
  const user = await User.create({
    fullName,
    username:  username.toLowerCase(),
    email:     email.toLowerCase(),
    password:  hashedPassword,
  });

  // 6. Generate token
  const token = generateToken(user);

  return { token, user: sanitizeUser(user) };
};

// ─── Login ────────────────────────────────────────────────────────────────────

/**
 * Login with email + password.
 * - Uses .select('+password') because password has select:false in schema
 * - Returns JWT + sanitized user
 */
const login = async ({ email, password }) => {
  // 1. Check required fields
  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  // 2. Find user — explicitly select password since it's hidden by default
  let user;
  if (User.findOne.length === 1) {
    // Mock database version
    user = await User.findOne({ email: email.toLowerCase() });
  } else {
    // Mongoose version
    user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  }
  
  if (!user) throw createError('Invalid email or password', 401);

  // 3. Check if account is active
  if (!user.isActive) throw createError('Your account has been deactivated', 403);

  // 4. Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw createError('Invalid email or password', 401);

  // 5. Generate token
  const token = generateToken(user);

  return { token, user: sanitizeUser(user) };
};

// ─── Get Current User ─────────────────────────────────────────────────────────

/**
 * Return the currently authenticated user.
 * req.user is already populated by auth middleware (no password).
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw createError('User not found', 404);
  return sanitizeUser(user);
};

// ─── Update Profile ───────────────────────────────────────────────────────────

/**
 * Update a user's profile fields.
 * Sensitive fields (password, role, email, isVerified, isActive) are blocked here.
 */
const updateProfile = async (userId, body) => {
  // Strip fields that must not be changed via this endpoint
  const { password, role, email, isVerified, isActive, plan, ...allowedUpdates } = body;

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    { new: true, runValidators: true }
  );

  if (!user) throw createError('User not found', 404);
  return sanitizeUser(user);
};

module.exports = { register, login, getMe, updateProfile };
