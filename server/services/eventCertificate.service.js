const EventCertificate  = require('../models/EventCertificate');
const EventRegistration = require('../models/EventRegistration');
const Event             = require('../models/Event');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── ISSUE CERTIFICATE ────────────────────────────────────────────────────────
const issueCertificate = async (eventId, body, issuerId, userRole) => {
  const { userId, certificateType = 'participation', certificateUrl = '', rank, prize, achievements } = body;

  if (!userId) throw createError('User ID is required', 400);

  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  // Only organizer or admin can issue certificates
  if (event.organizer.toString() !== issuerId.toString() && userRole !== 'admin') {
    throw createError('Only the event organizer can issue certificates', 403);
  }

  // Event must be completed or live to issue certificates
  if (event.status !== 'completed' && event.status !== 'live') {
    throw createError('Certificates can only be issued for completed or live events', 400);
  }

  // Check if the user was registered (skip for organizer/mentor certificates)
  if (certificateType === 'participation') {
    const registration = await EventRegistration.findOne({ eventId, userId, status: { $in: ['registered', 'attended'] } });
    if (!registration) {
      throw createError('User is not registered for this event', 400);
    }
  }

  // Check for duplicate
  const existing = await EventCertificate.findOne({ eventId, userId, certificateType });
  if (existing) throw createError('Certificate already issued for this user and type', 409);

  const certificate = await EventCertificate.create({
    eventId,
    userId,
    certificateType,
    certificateUrl,
    rank: rank || null,
    prize: prize || '',
    achievements: achievements || [],
    issuedBy: issuerId,
  });

  return certificate;
};

// ─── GET CERTIFICATES FOR EVENT ───────────────────────────────────────────────
const getEventCertificates = async (eventId, userId, userRole) => {
  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  // Only organizer or admin can view all certificates
  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view all certificates for this event', 403);
  }

  return EventCertificate.find({ eventId })
    .populate('userId', 'fullName avatar email')
    .populate('issuedBy', 'fullName avatar')
    .sort({ issuedAt: -1 });
};

// ─── GET MY CERTIFICATES ──────────────────────────────────────────────────────
const getMyCertificates = async (userId) => {
  return EventCertificate.find({ userId })
    .populate({
      path:   'eventId',
      select: 'title startDate endDate eventType organizer',
      populate: { path: 'organizer', select: 'fullName avatar' },
    })
    .sort({ issuedAt: -1 });
};

module.exports = { issueCertificate, getEventCertificates, getMyCertificates };
