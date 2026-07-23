const EVENT_TYPES = {
  HACKATHON:      'hackathon',
  WORKSHOP:       'workshop',
  CODING_CONTEST: 'coding_contest',
  WEBINAR:        'webinar',
  MEETUP:         'meetup',
  CONFERENCE:     'conference',
  NETWORKING:     'networking',
  BOOTCAMP:       'bootcamp',
  SEMINAR:        'seminar',
};

const EVENT_MODES = {
  ONLINE:  'online',
  OFFLINE: 'offline',
  HYBRID:  'hybrid',
};

const EVENT_STATUS = {
  DRAFT:               'draft',
  UPCOMING:            'upcoming',
  REGISTRATION_OPEN:   'registration_open',
  REGISTRATION_CLOSED: 'registration_closed',
  LIVE:                'live',
  COMPLETED:           'completed',
  CANCELLED:           'cancelled',
};

module.exports = { EVENT_TYPES, EVENT_MODES, EVENT_STATUS };
