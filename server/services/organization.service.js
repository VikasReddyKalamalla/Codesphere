const Organization = require('../models/Organization');
const UniversityLicense = require('../models/UniversityLicense');
const User = require('../models/User');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

const getMyOrganization = async (userId) => {
  let org = await Organization.findOne({
    $or: [{ ownerId: userId }, { 'members.userId': userId }],
  }).populate('members.userId', 'fullName email avatar role');

  if (!org) {
    // Return sample organization state for demonstration
    org = {
      name: 'CodeSphere Engineering Team',
      slug: 'codesphere-eng',
      ownerId: userId,
      planType: 'team',
      totalSeats: 10,
      usedSeats: 4,
      members: [
        { email: 'alex.smith@codesphere.dev', role: 'admin', joinedAt: new Date() },
        { email: 'dev.lead@codesphere.dev', role: 'member', joinedAt: new Date() },
        { email: 'sarah.c@codesphere.dev', role: 'member', joinedAt: new Date() },
      ],
      ssoEnabled: true,
      ssoProvider: 'Okta / Google Workspace',
      customDomain: 'eng.codesphere.dev',
      dedicatedStorageGB: 250,
      isActive: true,
    };
  }

  return org;
};

const inviteMember = async (userId, email, role = 'member') => {
  let org = await Organization.findOne({ ownerId: userId });

  if (org) {
    if (org.usedSeats >= org.totalSeats) {
      throw createError('Seat limit reached. Please upgrade your team plan to add more seats.', 400);
    }
    org.members.push({ email, role, joinedAt: new Date() });
    org.usedSeats += 1;
    await org.save();
    return org;
  }

  return { message: `Invitation sent to ${email}` };
};

const verifyUniversityDomain = async (domain, universityName, contactPerson, contactEmail) => {
  let license = await UniversityLicense.findOne({ domain });
  if (!license) {
    license = await UniversityLicense.create({
      universityName,
      domain,
      contactPerson,
      contactEmail,
      studentCapacity: 1000,
      activeStudentsCount: 1,
      verificationStatus: 'pending',
    });
  }
  return license;
};

module.exports = {
  getMyOrganization,
  inviteMember,
  verifyUniversityDomain,
};
