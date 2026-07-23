// ─── Event Validation Rules ───────────────────────────────────────────────────

const createEventRules = {
  title:                { required: true,  type: 'string', maxLength: 200 },
  description:          { required: false, type: 'string', maxLength: 5000 },
  eventType:            { required: true,  type: 'string', enum: ['hackathon', 'workshop', 'coding_contest', 'webinar', 'meetup', 'conference', 'networking', 'bootcamp', 'seminar'] },
  mode:                 { required: false, type: 'string', enum: ['online', 'offline', 'hybrid'] },
  difficulty:           { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'all'] },
  language:             { required: false, type: 'string' },
  tags:                 { required: false, type: 'array' },
  category:             { required: false, type: 'objectId' },
  community:            { required: false, type: 'objectId' },
  bannerImage:          { required: false, type: 'string' },
  thumbnail:            { required: false, type: 'string' },
  location:             { required: false, type: 'string' },
  country:              { required: false, type: 'string' },
  city:                 { required: false, type: 'string' },
  latitude:             { required: false, type: 'number' },
  longitude:            { required: false, type: 'number' },
  startDate:            { required: true,  type: 'date' },
  endDate:              { required: true,  type: 'date' },
  registrationDeadline: { required: false, type: 'date' },
  maxParticipants:      { required: false, type: 'number', min: 0 },
  entryFee:             { required: false, type: 'number', min: 0 },
  prizePool:            { required: false, type: 'string' },
  meetingLink:          { required: false, type: 'string' },
  website:              { required: false, type: 'string' },
};

const updateEventRules = {
  title:                { required: false, type: 'string', maxLength: 200 },
  description:          { required: false, type: 'string', maxLength: 5000 },
  eventType:            { required: false, type: 'string', enum: ['hackathon', 'workshop', 'coding_contest', 'webinar', 'meetup', 'conference', 'networking', 'bootcamp', 'seminar'] },
  mode:                 { required: false, type: 'string', enum: ['online', 'offline', 'hybrid'] },
  difficulty:           { required: false, type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'all'] },
  language:             { required: false, type: 'string' },
  tags:                 { required: false, type: 'array' },
  category:             { required: false, type: 'objectId' },
  community:            { required: false, type: 'objectId' },
  bannerImage:          { required: false, type: 'string' },
  thumbnail:            { required: false, type: 'string' },
  location:             { required: false, type: 'string' },
  country:              { required: false, type: 'string' },
  city:                 { required: false, type: 'string' },
  startDate:            { required: false, type: 'date' },
  endDate:              { required: false, type: 'date' },
  registrationDeadline: { required: false, type: 'date' },
  maxParticipants:      { required: false, type: 'number', min: 0 },
  entryFee:             { required: false, type: 'number', min: 0 },
  prizePool:            { required: false, type: 'string' },
  meetingLink:          { required: false, type: 'string' },
  website:              { required: false, type: 'string' },
  status:               { required: false, type: 'string', enum: ['draft', 'upcoming', 'registration_open', 'registration_closed', 'live', 'completed', 'cancelled'] },
};

const rescheduleEventRules = {
  startDate: { required: true, type: 'date' },
  endDate:   { required: true, type: 'date' },
};

const cancelEventRules = {
  reason: { required: false, type: 'string', maxLength: 500 },
};

module.exports = { createEventRules, updateEventRules, rescheduleEventRules, cancelEventRules };
