/**
 * Mock In-Memory Database for Development Testing
 * Stores users in memory (clears on server restart)
 * Use only for development/testing - NOT for production
 */

// Pre-hashed passwords for development fallback
const defaultHash = '$2a$12$e0MYzXyjpJS7Pd0RVvHwHeFj5kF1O2W65fX.u.l/1rJ9M9nS1Cq0e'; // Password123!
const adminHash   = '$2a$12$8x1s2pXp.Kq.J.u9J0O/1.q9N1X8e2m1W8u.u.l/1rJ9M9nS1Cq0e'; // admin123
const instrHash   = '$2a$12$9y2t3qYq.Lr.K.v0K1P/2.r0O2Y9f3n2X9v.v.m/2sK0N0oT2Dr1f'; // instructor123

// In-memory storage with pre-seeded test accounts
const mockDB = {
  users: [
    { _id: '650000000000000000000001', fullName: 'Demo Student', username: 'hello', email: 'hello@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000002', fullName: 'Admin User', username: 'adminuser', email: 'admin@codesphere.dev', password: adminHash, role: 'admin', plan: 'premium', isActive: true },
    { _id: '650000000000000000000003', fullName: 'Sarah Chen', username: 'sarahchen', email: 'instructor@gmail.com', password: instrHash, role: 'instructor', isInstructor: true, plan: 'premium', isActive: true },
    { _id: '650000000000000000000004', fullName: 'Vikas Reddy', username: 'vikasreddy', email: 'vikas@example.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000005', fullName: 'Adshjf User', username: 'adshjf', email: 'adshjf@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000006', fullName: 'New Student', username: 'new2', email: 'new2@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000007', fullName: 'New Account', username: 'new_ocm', email: 'new@gmail.ocm', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000008', fullName: 'Onee Student', username: 'onee', email: 'onee@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000009', fullName: 'User One', username: 'user1', email: 'user1@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000010', fullName: 'Vikas Reddy K0', username: 'vikasreddyk0', email: 'vikasreddyk0@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
    { _id: '650000000000000000000011', fullName: 'VRK Student', username: 'vrk', email: 'vrk@gmail.com', password: defaultHash, role: 'student', plan: 'standard', isActive: true },
  ],
};

// Simple ID generator
let idCounter = 20;
const generateId = () => String(idCounter++);

const MockUser = {
  /**
   * Find user by email, username or ID
   */
  findOne: async (query) => {
    if (query.email) {
      const qe = String(query.email).trim().toLowerCase();
      return mockDB.users.find(u => u.email.toLowerCase() === qe);
    }
    if (query.username) {
      const qu = String(query.username).trim().toLowerCase();
      return mockDB.users.find(u => u.username.toLowerCase() === qu);
    }
    if (query._id) {
      return mockDB.users.find(u => String(u._id) === String(query._id));
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
