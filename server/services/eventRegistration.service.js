const EventRegistration = require('../models/EventRegistration');
const Event             = require('../models/Event');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── REGISTER FOR EVENT ───────────────────────────────────────────────────────
const registerForEvent = async (eventId, userId) => {
  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  if (!event.isPublished) {
    throw createError('Cannot register for an unpublished event', 400);
  }

  if (event.status === 'completed' || event.status === 'cancelled') {
    throw createError('Cannot register for a completed or cancelled event', 400);
  }

  if (event.status === 'registration_closed') {
    throw createError('Registration is closed for this event', 400);
  }

  // Check if already registered
  const existing = await EventRegistration.findOne({ eventId, userId });
  if (existing && existing.status === 'registered') {
    throw createError('You are already registered for this event', 409);
  }

  if (existing && existing.status === 'cancelled') {
    // Re-register
    existing.status = 'registered';
    existing.registeredAt = new Date();
    existing.cancelledAt = null;
    await existing.save();

    await Event.findByIdAndUpdate(eventId, { $inc: { registeredParticipants: 1 } });
    return existing;
  }

  // Check capacity
  let status = 'registered';
  if (event.maxParticipants > 0 && event.registeredParticipants >= event.maxParticipants) {
    if (!event.isWaitlistEnabled) {
      throw createError('Event is full', 400);
    }
    status = 'waitlisted';
  }

  const registration = await EventRegistration.create({ eventId, userId, status });

  // Increment registered count
  await Event.findByIdAndUpdate(eventId, { $inc: { registeredParticipants: 1 } });

  return registration;
};

// ─── CANCEL REGISTRATION ──────────────────────────────────────────────────────
const cancelRegistration = async (eventId, userId) => {
  const registration = await EventRegistration.findOne({ eventId, userId });
  if (!registration) throw createError('Registration not found', 404);

  if (registration.status === 'cancelled') {
    throw createError('Registration is already cancelled', 400);
  }

  registration.status = 'cancelled';
  registration.cancelledAt = new Date();
  await registration.save();

  // Decrement registered count
  await Event.findByIdAndUpdate(eventId, { $inc: { registeredParticipants: -1 } });

  return { message: 'Registration cancelled successfully' };
};

// ─── GET EVENT REGISTRATIONS (for organizer) ──────────────────────────────────
const getEventRegistrations = async (eventId, userId, userRole) => {
  const event = await Event.findById(eventId);
  if (!event) throw createError('Event not found', 404);

  // Only organizer or admin can view registrations
  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view registrations for this event', 403);
  }

  const registrations = await EventRegistration.find({ eventId, status: { $in: ['registered', 'waitlisted'] } })
    .populate('userId', 'fullName avatar email phone')
    .sort({ registeredAt: 1 });

  const registered = registrations.filter((r) => r.status === 'registered');
  const waitlisted = registrations.filter((r) => r.status === 'waitlisted');

  return {
    total: registrations.length,
    registered: registered.length,
    waitlisted: waitlisted.length,
    registrations: registered,
    waitlist: waitlisted,
  };
};

// ─── GET USER'S REGISTERED EVENTS ─────────────────────────────────────────────
const getUserRegistrations = async (userId) => {
  const registrations = await EventRegistration.find({ userId, status: 'registered' })
    .populate({
      path:   'eventId',
      select: 'title description thumbnail startDate endDate status organizer community eventType mode city country',
      populate: [
        { path: 'organizer', select: 'fullName avatar' },
        { path: 'community', select: 'name logo' },
      ],
    })
    .sort({ registeredAt: -1 });

  return registrations.filter((r) => r.eventId).map((r) => ({
    ...r.eventId.toObject(),
    registeredAt: r.registeredAt,
  }));
};

// ─── CHECK REGISTRATION STATUS ────────────────────────────────────────────────
const checkRegistrationStatus = async (eventId, userId) => {
  const registration = await EventRegistration.findOne({ eventId, userId });
  
  if (!registration) {
    return { isRegistered: false, status: null };
  }

  return {
    isRegistered: registration.status === 'registered' || registration.status === 'waitlisted',
    status: registration.status,
    registeredAt: registration.registeredAt,
  };
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getEventRegistrations,
  getUserRegistrations,
  checkRegistrationStatus,
};
