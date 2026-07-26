/**
 * Mock In-Memory Database for Development Testing
 * Stores users in memory (clears on server restart)
 * Use only for development/testing - NOT for production
 */

const bcrypt = require('bcryptjs');

// In-memory storage
const mockDB = {
  users: [],
};

// Simple ID generator
let idCounter = 1;
const generateId = () => String(idCounter++);

const MockUser = {
  /**
   * Find user by email
   */
  findOne: async (query) => {
    if (query.email) {
      return mockDB.users.find(u => u.email === query.email.toLowerCase());
    }
    if (query.username) {
      return mockDB.users.find(u => u.username === query.username.toLowerCase());
    }
    if (query._id) {
      return mockDB.users.find(u => u._id === query._id);
    }
    return null;
  },

  /**
   * Find user by ID
   */
  findById: async (id) => {
    return mockDB.users.find(u => u._id === id);
  },

  /**
   * Create a new user
   */
  create: async (userData) => {
    const user = {
      _id: generateId(),
      fullName: userData.fullName,
      username: userData.username.toLowerCase(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      phone: userData.phone || '',
      avatar: userData.avatar || '',
      bio: userData.bio || '',
      website: userData.website || '',
      location: userData.location || '',
      role: userData.role || 'user',
      plan: userData.plan || 'free',
      isInstructor: userData.isInstructor || false,
      applicationStatus: userData.applicationStatus || 'pending',
      isVerified: userData.isVerified || false,
      isActive: userData.isActive !== false,
      dayStreak: userData.dayStreak || 0,
      achievementPoints: userData.achievementPoints || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockDB.users.push(user);
    return user;
  },

  /**
   * Find by ID and update
   */
  findByIdAndUpdate: async (id, update, options = {}) => {
    const user = mockDB.users.find(u => u._id === id);
    if (!user) return null;
    
    const $set = update.$set || update;
    Object.assign(user, $set);
    user.updatedAt = new Date();
    
    return user;
  },
};

module.exports = MockUser;
