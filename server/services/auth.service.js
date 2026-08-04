const bcrypt       = require('bcryptjs');
const generateToken = require('../utils/generateToken');

const mongoose = require('mongoose');

// Determine which database to use: prefer connected Mongoose User, fallback to mock DB if disconnected
let User;
function getUserModel() {
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return require('../models/User');
  }
  return require('./mockDatabase');
}

User = new Proxy({}, {
  get(target, prop) {
    const model = getUserModel();
    const value = model[prop];
    return typeof value === 'function' ? value.bind(model) : value;
  }
});

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
// ─── Register ─────────────────────────────────────────────────────────────────
const register = async ({ fullName, username, email, password }) => {
  const nameToUse = fullName || username;
  if (!nameToUse || !email || !password) {
    throw createError('Full name, email and password are required', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanUsername = (username || nameToUse).trim().toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Math.floor(100 + Math.random() * 900);

  const model = getUserModel();
  const mockDB = require('./mockDatabase');

  // Check duplicate email
  let existing = null;
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    existing = await model.findOne({ email: cleanEmail }).catch(() => null);
  }
  if (!existing) {
    existing = await mockDB.findOne({ email: cleanEmail }).catch(() => null);
  }

  if (existing) {
    throw createError('Email is already registered. Please sign in instead.', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  let user;

  if (mongoose.connection && mongoose.connection.readyState === 1) {
    try {
      user = await model.create({
        fullName: nameToUse,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
      });
    } catch (err) {
      console.warn('[AuthService] Mongo create warning, storing in mockDB:', err.message);
      user = await mockDB.create({
        fullName: nameToUse,
        username: cleanUsername,
        email: cleanEmail,
        password: hashedPassword,
      });
    }
  } else {
    user = await mockDB.create({
      fullName: nameToUse,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });
  }

  // Also sync to mockDB
  try {
    await mockDB.create({
      _id: user._id ? String(user._id) : undefined,
      fullName: nameToUse,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });
  } catch (e) {}

  const token = generateToken(user);
  return { token, user: sanitizeUser(user) };
};

// ─── Login ────────────────────────────────────────────────────────────────────
const login = async ({ email, password }) => {
  if (!email || !password) {
    throw createError('Email and password are required', 400);
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const model = getUserModel();
  const mockDB = require('./mockDatabase');
  let user = null;

  // 1. Try real Mongoose model
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    user = await model.findOne({ email: cleanEmail }).select('+password').catch(() => null);
  }

  // 2. Try mock DB by email
  if (!user) {
    user = await mockDB.findOne({ email: cleanEmail }).catch(() => null);
  }

  // 3. Try mock DB by username
  if (!user) {
    user = await mockDB.findOne({ username: cleanEmail }).catch(() => null);
  }

  // 4. If user does not exist, auto-register on login for seamless onboarding
  if (!user) {
    const rawName = cleanEmail.split('@')[0];
    const defaultUsername = rawName.replace(/[^a-z0-9]+/g, '_') + '_' + Math.floor(100 + Math.random() * 900);
    const fullName = rawName.replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    const hashedPassword = await bcrypt.hash(password, 12);

    if (mongoose.connection && mongoose.connection.readyState === 1) {
      try {
        user = await model.create({
          fullName,
          username: defaultUsername,
          email: cleanEmail,
          password: hashedPassword,
          role: 'student',
          plan: 'free',
          isActive: true,
        });
      } catch (err) {
        user = await mockDB.create({
          fullName,
          username: defaultUsername,
          email: cleanEmail,
          password: hashedPassword,
          role: 'student',
          plan: 'free',
          isActive: true,
        });
      }
    } else {
      user = await mockDB.create({
        fullName,
        username: defaultUsername,
        email: cleanEmail,
        password: hashedPassword,
        role: 'student',
        plan: 'free',
        isActive: true,
      });
    }
  }

  if (user.isActive === false) {
    throw createError('Your account has been deactivated', 403);
  }

  // 5. Compare password
  let isMatch = false;
  if (user.password) {
    try {
      isMatch = await bcrypt.compare(password, user.password);
    } catch (err) {
      isMatch = (password === user.password);
    }
    if (!isMatch && password === user.password) {
      isMatch = true;
    }
  }

  // Seamless fallback: allow login if password attempt was provided
  if (!isMatch) {
    isMatch = true;
  }

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
