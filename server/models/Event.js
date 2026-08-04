const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    // ─── Core Info ────────────────────────────────────────────────────────────
    title: {
      type:      String,
      required:  [true, 'Event title is required'],
      trim:      true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type:      String,
      default:   '',
      maxlength: [10000, 'Description cannot exceed 10000 characters'],
    },
    slug: {
      type:   String,
      unique: true,
      trim:   true,
    },

    // ─── Organizer & Company ───────────────────────────────────────────────────
    organizer: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'Organizer is required'],
    },
    companyName: { type: String, default: 'CodeSphere Partner', trim: true },
    companyLogo: { type: String, default: '' },
    source:      { type: String, default: 'internal', enum: ['internal', 'user_created', 'github', 'devpost', 'mlh', 'unstop', 'hackerearth', 'meetup', 'eventbrite', 'google', 'microsoft', 'aws', 'meta', 'apple'] },
    externalUrl: { type: String, default: '' },

    // ─── Classification ───────────────────────────────────────────────────────
    category: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'EventCategory',
      default: null,
    },
    categoryName: { type: String, default: 'General' },
    categoryColor: { type: String, default: '#8B5CF6' },
    eventType: {
      type:    String,
      enum:    [
        'hackathon', 'coding_contest', 'conference', 'meetup', 'ai_conference',
        'ml_event', 'cybersecurity_conf', 'cloud_summit', 'blockchain_event',
        'gamedev_event', 'workshop', 'seminar', 'webinar', 'career_fair',
        'campus_drive', 'placement_drive', 'startup_pitch', 'open_source_event',
        'tech_fest', 'bootcamp', 'networking'
      ],
      default: 'hackathon',
    },
    mode: {
      type:    String,
      enum:    ['online', 'offline', 'hybrid'],
      default: 'online',
    },
    difficulty: {
      type:    String,
      enum:    ['beginner', 'intermediate', 'advanced', 'all'],
      default: 'all',
    },
    language: { type: String, default: 'English', trim: true },
    tags:     [{ type: String, trim: true, lowercase: true }],

    // ─── Media ────────────────────────────────────────────────────────────────
    bannerImage: { type: String, default: '' },
    thumbnail:   { type: String, default: '' },
    brochureUrl: { type: String, default: '' },
    gallery:     [{ type: String }],

    // ─── Community Link ───────────────────────────────────────────────────────
    community: {
      type:    mongoose.Schema.Types.ObjectId,
      ref:     'Community',
      default: null,
    },

    // ─── Location & Geocoding ─────────────────────────────────────────────────
    location:  { type: String, default: 'Online Event' },
    country:   { type: String, default: 'Global' },
    city:      { type: String, default: 'Remote' },
    venue:     { type: String, default: 'Virtual Classroom & Livestream' },
    timezone:  { type: String, default: 'UTC' },
    latitude:  { type: Number, default: 20.5937 },
    longitude: { type: Number, default: 78.9629 },

    // ─── Scheduling ───────────────────────────────────────────────────────────
    startDate:            { type: Date, required: [true, 'Start date is required'] },
    endDate:              { type: Date, required: [true, 'End date is required'] },
    registrationDeadline: { type: Date, default: null },

    // ─── Capacity & Participation ─────────────────────────────────────────────
    maxParticipants:        { type: Number, default: 0 },  // 0 = unlimited
    registeredParticipants: { type: Number, default: 0 },
    isWaitlistEnabled:      { type: Boolean, default: false },
    participationType:      { type: String, enum: ['individual', 'team', 'both'], default: 'both' },
    teamSize: {
      min: { type: Number, default: 1 },
      max: { type: Number, default: 4 },
    },
    eligibility: { type: String, default: 'Open to all students, professionals, and coding enthusiasts worldwide.' },

    // ─── Pricing & Rewards ────────────────────────────────────────────────────
    entryFee:  { type: Number, default: 0 },   // 0 = free
    currency:  { type: String, default: 'USD' },
    prizePool: { type: String, default: '$0' },
    prizePoolAmount: { type: Number, default: 0 },
    prizes: [
      {
        position:    { type: String },
        reward:      { type: String },
        description: { type: String },
      }
    ],
    certificateProvided: { type: Boolean, default: true },

    // ─── Hackathon & Event Modules ────────────────────────────────────────────
    problemStatements: [
      {
        track:       { type: String },
        title:       { type: String },
        description: { type: String },
      }
    ],
    judgingCriteria: [
      {
        criterion:   { type: String },
        weight:      { type: String },
        description: { type: String },
      }
    ],
    speakers: [
      {
        name:        { type: String },
        role:        { type: String },
        company:     { type: String },
        bio:         { type: String },
        avatar:      { type: String },
        topic:       { type: String },
        socialLinks: { twitter: String, linkedin: String, github: String },
      }
    ],
    judges: [
      {
        name:    { type: String },
        title:   { type: String },
        company: { type: String },
        avatar:  { type: String },
      }
    ],
    mentors: [
      {
        name:    { type: String },
        title:   { type: String },
        company: { type: String },
        avatar:  { type: String },
      }
    ],
    sponsors: [
      {
        name:    { type: String },
        logo:    { type: String },
        tier:    { type: String, enum: ['title', 'platinum', 'gold', 'silver', 'community'], default: 'gold' },
        website: { type: String },
      }
    ],
    agenda: [
      {
        time:        { type: String },
        title:       { type: String },
        speaker:     { type: String },
        description: { type: String },
      }
    ],
    rules: [{ type: String }],
    faqs: [
      {
        question: { type: String },
        answer:   { type: String },
      }
    ],
    resources: [
      {
        title: { type: String },
        url:   { type: String },
        type:  { type: String, default: 'link' },
      }
    ],

    // ─── Links ────────────────────────────────────────────────────────────────
    meetingLink: { type: String, default: '' },
    website:     { type: String, default: '' },
    socialLinks: {
      discord:   { type: String, default: '' },
      twitter:   { type: String, default: '' },
      github:    { type: String, default: '' },
      linkedin:  { type: String, default: '' },
    },

    // ─── Status & Moderation ──────────────────────────────────────────────────
    status: {
      type:    String,
      enum:    ['draft', 'upcoming', 'registration_open', 'registration_closed', 'live', 'completed', 'cancelled'],
      default: 'registration_open',
    },
    isPublished:   { type: Boolean, default: true },
    isFeatured:    { type: Boolean, default: false },
    isTrending:    { type: Boolean, default: false },
    cancelReason:  { type: String, default: '' },

    // ─── Stats & Engagement ───────────────────────────────────────────────────
    viewCount:      { type: Number, default: 0 },
    bookmarkCount:  { type: Number, default: 0 },
    likeCount:      { type: Number, default: 0 },
    commentCount:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ─── Auto-generate slug before save ──────────────────────────────────────────
eventSchema.pre('save', function () {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      + '-' + Date.now();
  }
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
eventSchema.index({ organizer: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });
eventSchema.index({ community: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ country: 1, city: 1 });
eventSchema.index({ latitude: 1, longitude: 1 });
eventSchema.index({ isFeatured: 1, isTrending: 1 });
eventSchema.index({ title: 'text', description: 'text', tags: 'text', companyName: 'text', location: 'text' });

module.exports = mongoose.model('Event', eventSchema);
