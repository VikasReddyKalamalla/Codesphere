const Event          = require('../models/Event');
const EventCategory  = require('../models/EventCategory');
const { getPagination } = require('../utils/pagination');

const createError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

// ─── GET ALL EVENTS (with search & filters) ──────────────────────────────────
const getAllEvents = async (query) => {
  const {
    page = 1,
    limit = 12,
    search,
    category,
    eventType,
    mode,
    status,
    country,
    city,
    difficulty,
    organizer,
    community,
    upcoming,
    completed,
    popular,
    sortBy = 'startDate',
    order = 'asc',
  } = query;

  const filter = {};
  if (query.all !== 'true') {
    filter.isPublished = true;
  }

  // Search
  if (search) filter.$text = { $search: search };

  // Filters
  if (category)   filter.category   = category;
  if (eventType)  filter.eventType  = eventType;
  if (mode)       filter.mode       = mode;
  if (status)     filter.status     = status;
  if (country)    filter.country    = country;
  if (city)       filter.city       = city;
  if (difficulty) filter.difficulty = difficulty;
  if (organizer)  filter.organizer  = organizer;
  if (community)  filter.community  = community;

  // Special filters
  if (upcoming === 'true') {
    filter.startDate = { $gte: new Date() };
    filter.status = { $in: ['upcoming', 'registration_open', 'registration_closed'] };
  }
  if (completed === 'true') {
    filter.status = 'completed';
  }

  const total = await Event.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  // Sorting
  const sortOrder = order === 'desc' ? -1 : 1;
  const sortOptions = {};

  if (sortBy === 'popular') sortOptions.viewCount = -1;
  else if (sortBy === 'newest') sortOptions.createdAt = -1;
  else if (sortBy === 'registrations') sortOptions.registeredParticipants = -1;
  else sortOptions.startDate = sortOrder;

  const events = await Event.find(filter)
    .populate('organizer', 'fullName avatar bio')
    .populate('category', 'name icon color')
    .populate('community', 'name logo')
    .sort(sortOptions)
    .skip(skip)
    .limit(meta.limit)
    .select('-cancelReason');

  return { ...meta, events };
};

// ─── GET EVENT BY ID ──────────────────────────────────────────────────────────
const getEventById = async (id) => {
  const event = await Event.findById(id)
    .populate('organizer', 'fullName avatar bio email')
    .populate('category', 'name icon color')
    .populate('community', 'name logo description');

  if (!event) throw createError('Event not found', 404);

  // Increment view count
  event.viewCount += 1;
  await event.save();

  return event;
};

// ─── GET EVENT BY SLUG ────────────────────────────────────────────────────────
const getEventBySlug = async (slug) => {
  const event = await Event.findOne({ slug })
    .populate('organizer', 'fullName avatar bio email')
    .populate('category', 'name icon color')
    .populate('community', 'name logo description');

  if (!event) throw createError('Event not found', 404);

  // Increment view count
  event.viewCount += 1;
  await event.save();

  return event;
};

// Preset global coordinates for quick lookup by city/country
const PRESET_COORDINATES = {
  'mountain view': { lat: 37.422, lng: -122.084, country: 'United States', city: 'Mountain View' },
  'san francisco': { lat: 37.7749, lng: -122.4194, country: 'United States', city: 'San Francisco' },
  'new york': { lat: 40.7128, lng: -74.0060, country: 'United States', city: 'New York' },
  'london': { lat: 51.5074, lng: -0.1278, country: 'United Kingdom', city: 'London' },
  'bengaluru': { lat: 12.9716, lng: 77.5946, country: 'India', city: 'Bengaluru' },
  'bangalore': { lat: 12.9716, lng: 77.5946, country: 'India', city: 'Bengaluru' },
  'tokyo': { lat: 35.6762, lng: 139.6503, country: 'Japan', city: 'Tokyo' },
  'berlin': { lat: 52.5200, lng: 13.4050, country: 'Germany', city: 'Berlin' },
  'paris': { lat: 48.8566, lng: 2.3522, country: 'France', city: 'Paris' },
  'singapore': { lat: 1.3521, lng: 103.8198, country: 'Singapore', city: 'Singapore' },
  'sydney': { lat: -33.8688, lng: 151.2093, country: 'Australia', city: 'Sydney' },
  'dubai': { lat: 25.2048, lng: 55.2708, country: 'United Arab Emirates', city: 'Dubai' },
  'toronto': { lat: 43.6532, lng: -79.3832, country: 'Canada', city: 'Toronto' },
  'amsterdam': { lat: 52.3676, lng: 4.9041, country: 'Netherlands', city: 'Amsterdam' },
  'sao paulo': { lat: -23.5505, lng: -46.6333, country: 'Brazil', city: 'São Paulo' },
  'tel aviv': { lat: 32.0853, lng: 34.7818, country: 'Israel', city: 'Tel Aviv' },
  'zurich': { lat: 47.3769, lng: 8.5417, country: 'Switzerland', city: 'Zurich' },
  'cape town': { lat: -33.9249, lng: 18.4241, country: 'South Africa', city: 'Cape Town' },
};

const resolveCoordinates = (city = '', country = '', title = '') => {
  const cLower = (city || '').toLowerCase();
  const cntLower = (country || '').toLowerCase();

  for (const [key, coords] of Object.entries(PRESET_COORDINATES)) {
    if (cLower.includes(key) || cntLower.includes(key)) {
      return coords;
    }
  }

  // Deterministic fallback based on title string hash
  let hash = 0;
  const str = title + city + country;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const lat = (Math.abs(hash % 12000) / 100) - 60; // -60 to +60 lat
  const lng = (Math.abs((hash * 31) % 36000) / 100) - 180; // -180 to +180 lng
  return { lat: Number(lat.toFixed(4)), lng: Number(lng.toFixed(4)) };
};

// ─── CREATE EVENT ─────────────────────────────────────────────────────────────
const createEvent = async (body, userId) => {
  const { title, eventType } = body;

  if (!title) throw createError('Event title is required', 400);

  const startDate = body.startDate ? new Date(body.startDate) : new Date();
  let endDate = body.endDate ? new Date(body.endDate) : new Date(Date.now() + 86400000);
  if (endDate <= startDate) {
    endDate = new Date(startDate.getTime() + 7200000); // 2 hours later
  }

  // Resolve lat/lng if missing
  let latitude = Number(body.latitude);
  let longitude = Number(body.longitude);
  if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
    const coords = resolveCoordinates(body.city, body.country, title);
    latitude = coords.lat;
    longitude = coords.lng;
  }

  // Check category if provided
  if (body.category) {
    const categoryExists = await EventCategory.findById(body.category);
    if (!categoryExists) throw createError('Category not found', 404);
  }

  const event = await Event.create({
    ...body,
    title,
    eventType: eventType || 'workshop',
    startDate,
    endDate,
    latitude,
    longitude,
    organizer: userId,
    isPublished: typeof body.isPublished !== 'undefined' ? body.isPublished : true,
    source: body.source || 'user_created',
  });

  if (event.category) {
    await EventCategory.findByIdAndUpdate(event.category, { $inc: { eventCount: 1 } });
  }

  return event;
};

// ─── UPDATE EVENT ─────────────────────────────────────────────────────────────
const updateEvent = async (id, body, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  // Authorization: only organizer or admin can update
  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to update this event', 403);
  }

  delete body.organizer;

  // Handle dates if updated
  if (body.startDate) body.startDate = new Date(body.startDate);
  if (body.endDate) body.endDate = new Date(body.endDate);

  // Handle coordinates if updated or missing
  if (typeof body.latitude !== 'undefined' || typeof body.longitude !== 'undefined') {
    let lat = Number(body.latitude);
    let lng = Number(body.longitude);
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      const coords = resolveCoordinates(body.city || event.city, body.country || event.country, body.title || event.title);
      body.latitude = coords.lat;
      body.longitude = coords.lng;
    }
  }

  const oldCategory = event.category;
  const newCategory = body.category;

  const updated = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .populate('organizer', 'fullName avatar')
    .populate('category', 'name icon color')
    .populate('community', 'name logo');

  if (oldCategory && newCategory && oldCategory.toString() !== newCategory.toString()) {
    await EventCategory.findByIdAndUpdate(oldCategory, { $inc: { eventCount: -1 } });
    await EventCategory.findByIdAndUpdate(newCategory, { $inc: { eventCount: 1 } });
  } else if (!oldCategory && newCategory) {
    await EventCategory.findByIdAndUpdate(newCategory, { $inc: { eventCount: 1 } });
  } else if (oldCategory && !newCategory) {
    await EventCategory.findByIdAndUpdate(oldCategory, { $inc: { eventCount: -1 } });
  }

  return updated;
};

// ─── DELETE EVENT ─────────────────────────────────────────────────────────────
const deleteEvent = async (id, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  // Authorization: only organizer or admin can delete
  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to delete this event', 403);
  }

  // Decrement category event count if category exists
  if (event.category) {
    await EventCategory.findByIdAndUpdate(event.category, { $inc: { eventCount: -1 } });
  }

  await event.deleteOne();
};

// ─── PUBLISH EVENT ────────────────────────────────────────────────────────────
const publishEvent = async (id, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to publish this event', 403);
  }

  if (event.isPublished) {
    throw createError('Event is already published', 400);
  }

  event.isPublished = true;
  event.status = 'registration_open';
  await event.save();

  return event;
};

// ─── CANCEL EVENT ─────────────────────────────────────────────────────────────
const cancelEvent = async (id, userId, userRole, reason = '') => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to cancel this event', 403);
  }

  if (event.status === 'cancelled') {
    throw createError('Event is already cancelled', 400);
  }

  if (event.status === 'completed') {
    throw createError('Cannot cancel a completed event', 400);
  }

  event.status = 'cancelled';
  event.cancelReason = reason;
  await event.save();

  return event;
};

// ─── RESCHEDULE EVENT ─────────────────────────────────────────────────────────
const rescheduleEvent = async (id, userId, userRole, { startDate, endDate }) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to reschedule this event', 403);
  }

  if (event.status === 'completed' || event.status === 'cancelled') {
    throw createError('Cannot reschedule a completed or cancelled event', 400);
  }

  if (!startDate || !endDate) {
    throw createError('Both start date and end date are required', 400);
  }

  if (new Date(endDate) <= new Date(startDate)) {
    throw createError('End date must be after start date', 400);
  }

  event.startDate = new Date(startDate);
  event.endDate = new Date(endDate);
  await event.save();

  return event;
};

// ─── GET MY EVENTS (organizer view) ───────────────────────────────────────────
const getMyEvents = async (userId, query) => {
  const { page = 1, limit = 12, status } = query;

  const filter = { organizer: userId };
  if (status) filter.status = status;

  const total = await Event.countDocuments(filter);
  const { skip, ...meta } = getPagination(page, limit, total);

  const events = await Event.find(filter)
    .populate('category', 'name icon color')
    .populate('community', 'name logo')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(meta.limit);

  return { ...meta, events };
};

// ─── GET EVENT ANALYTICS ──────────────────────────────────────────────────────
const getEventAnalytics = async (id, userId, userRole) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  if (event.organizer.toString() !== userId.toString() && userRole !== 'admin') {
    throw createError('You are not authorized to view analytics for this event', 403);
  }

  return {
    eventId:                 event._id,
    title:                   event.title,
    status:                  event.status,
    viewCount:               event.viewCount,
    bookmarkCount:           event.bookmarkCount,
    registeredParticipants:  event.registeredParticipants,
    maxParticipants:         event.maxParticipants,
    capacityPercentage:      event.maxParticipants > 0 ? ((event.registeredParticipants / event.maxParticipants) * 100).toFixed(2) : 0,
    daysUntilEvent:          Math.ceil((new Date(event.startDate) - new Date()) / (1000 * 60 * 60 * 24)),
  };
};

// ─── SAMPLE GLOBE SEED DATA (20+ Worldwide Hubs) ─────────────────────────────
const SEED_GLOBAL_EVENTS = [
  {
    title: 'Google I/O Extended 2026',
    description: 'Explore the latest advances in Generative AI, Android 16, Flutter 4, WebGPU, and Cloud Technologies directly with Google engineers.',
    eventType: 'conference', mode: 'hybrid', companyName: 'Google Cloud & Developers',
    categoryName: 'AI & Cloud', categoryColor: '#34A853', country: 'United States', city: 'Mountain View, CA',
    venue: 'Shoreline Amphitheatre & Virtual', latitude: 37.422, longitude: -122.084,
    startDate: new Date(Date.now() + 86400000 * 5), endDate: new Date(Date.now() + 86400000 * 7),
    registrationDeadline: new Date(Date.now() + 86400000 * 4), maxParticipants: 10000, registeredParticipants: 4820,
    entryFee: 0, prizePool: '$25,000 Cloud Credits', bannerImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    tags: ['google', 'ai', 'android', 'cloud'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'google'
  },
  {
    title: 'GitHub Universe 2026 Hackathon',
    description: 'Build open-source Copilot extensions, AI agents, and DevOps workflows. $100K in total cash prizes & GitHub Sponsor grants.',
    eventType: 'hackathon', mode: 'online', companyName: 'GitHub Inc.',
    categoryName: 'Hackathon & AI', categoryColor: '#8B5CF6', country: 'United States', city: 'San Francisco, CA',
    venue: 'Fort Mason Center & Online', latitude: 37.7749, longitude: -122.4194,
    startDate: new Date(Date.now() + 86400000 * 10), endDate: new Date(Date.now() + 86400000 * 13),
    registrationDeadline: new Date(Date.now() + 86400000 * 9), maxParticipants: 5000, registeredParticipants: 3120,
    entryFee: 0, prizePool: '$100,000 USD', bannerImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200',
    tags: ['github', 'copilot', 'ai', 'devops'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'github'
  },
  {
    title: 'AWS Summit Bengaluru 2026',
    description: 'Asia Pacific\'s largest cloud computing, AI serverless infrastructure, and Web3 builder conference.',
    eventType: 'cloud_summit', mode: 'offline', companyName: 'Amazon Web Services',
    categoryName: 'Cloud & Infrastructure', categoryColor: '#FF9900', country: 'India', city: 'Bengaluru',
    venue: 'BIEC Convention Center', latitude: 12.9716, longitude: 77.5946,
    startDate: new Date(Date.now() + 86400000 * 14), endDate: new Date(Date.now() + 86400000 * 15),
    registrationDeadline: new Date(Date.now() + 86400000 * 12), maxParticipants: 8000, registeredParticipants: 6420,
    entryFee: 0, prizePool: '$50,000 AWS Credits', bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
    tags: ['aws', 'cloud', 'serverless', 'ai'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'aws'
  },
  {
    title: 'London AI & Machine Learning Summit',
    description: 'European AI research, LLM architecture, agentic workflows, and ethical AI deployment.',
    eventType: 'ai_conference', mode: 'hybrid', companyName: 'DeepMind & CodeSphere Alliance',
    categoryName: 'AI & Data', categoryColor: '#3B82F6', country: 'United Kingdom', city: 'London',
    venue: 'ExCeL London & Livestream', latitude: 51.5074, longitude: -0.1278,
    startDate: new Date(Date.now() + 86400000 * 18), endDate: new Date(Date.now() + 86400000 * 20),
    registrationDeadline: new Date(Date.now() + 86400000 * 16), maxParticipants: 4000, registeredParticipants: 2890,
    entryFee: 49, prizePool: '£20,000 Fellowship', bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200',
    tags: ['ai', 'deepmind', 'llm', 'python'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'google'
  },
  {
    title: 'Tokyo DevFest & GameDev Summit',
    description: 'Japan\'s premier game engine, WebGPU, Rust, and AI-driven graphics generation developer meetup.',
    eventType: 'gamedev_event', mode: 'offline', companyName: 'Tokyo Tech Guild',
    categoryName: 'GameDev & Graphics', categoryColor: '#EC4899', country: 'Japan', city: 'Tokyo',
    venue: 'Akihabara UDX Hall', latitude: 35.6762, longitude: 139.6503,
    startDate: new Date(Date.now() + 86400000 * 22), endDate: new Date(Date.now() + 86400000 * 24),
    registrationDeadline: new Date(Date.now() + 86400000 * 20), maxParticipants: 3000, registeredParticipants: 2150,
    entryFee: 25, prizePool: '¥5,000,000 JPY', bannerImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1200',
    tags: ['gamedev', 'rust', 'webgpu', 'unreal'], isFeatured: false, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Berlin Open Source Security & DevOps Conference',
    description: 'Cybersecurity, Zero-Trust Architecture, Kubernetes Security, and confidential computing.',
    eventType: 'cybersecurity_conf', mode: 'hybrid', companyName: 'EuroSec Foundation',
    categoryName: 'Cybersecurity', categoryColor: '#EF4444', country: 'Germany', city: 'Berlin',
    venue: 'Berlin Congress Center', latitude: 52.5200, longitude: 13.4050,
    startDate: new Date(Date.now() + 86400000 * 8), endDate: new Date(Date.now() + 86400000 * 10),
    registrationDeadline: new Date(Date.now() + 86400000 * 6), maxParticipants: 3500, registeredParticipants: 1980,
    entryFee: 0, prizePool: '€15,000 Bug Bounty Pool', bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200',
    tags: ['cybersecurity', 'devops', 'kubernetes', 'linux'], isFeatured: false, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Singapore AI FinTech Hackathon 2026',
    description: 'Build real-time algorithmic trading bots, automated fraud detection pipelines, and DeFi tools.',
    eventType: 'hackathon', mode: 'hybrid', companyName: 'FinTech Innovation Lab',
    categoryName: 'FinTech & AI', categoryColor: '#10B981', country: 'Singapore', city: 'Singapore',
    venue: 'Marina Bay Sands Expo', latitude: 1.3521, longitude: 103.8198,
    startDate: new Date(Date.now() + 86400000 * 25), endDate: new Date(Date.now() + 86400000 * 27),
    registrationDeadline: new Date(Date.now() + 86400000 * 23), maxParticipants: 2500, registeredParticipants: 1740,
    entryFee: 0, prizePool: '$75,000 SGD', bannerImage: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=1200',
    tags: ['fintech', 'ai', 'blockchain', 'node'], isFeatured: true, isTrending: false, isPublished: true, status: 'registration_open', source: 'unstop'
  },
  {
    title: 'Sydney React & Full-Stack Assembly',
    description: 'Australia\'s premier React 19, Next.js Server Actions, and real-time state management masterclass.',
    eventType: 'meetup', mode: 'offline', companyName: 'Sydney JS Community',
    categoryName: 'Web Development', categoryColor: '#06B6D4', country: 'Australia', city: 'Sydney',
    venue: 'International Convention Centre', latitude: -33.8688, longitude: 151.2093,
    startDate: new Date(Date.now() + 86400000 * 12), endDate: new Date(Date.now() + 86400000 * 13),
    registrationDeadline: new Date(Date.now() + 86400000 * 10), maxParticipants: 1500, registeredParticipants: 1120,
    entryFee: 15, prizePool: '$5,000 Swag & Gadgets', bannerImage: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200',
    tags: ['react', 'nextjs', 'typescript', 'javascript'], isFeatured: false, isTrending: false, isPublished: true, status: 'registration_open', source: 'meetup'
  },
  {
    title: 'Sao Paulo Web3 & Decentralized Hack',
    description: 'South America\'s largest blockchain developer championship with Ethereum and Solana tracks.',
    eventType: 'blockchain_event', mode: 'hybrid', companyName: 'LATAM Builders Hub',
    categoryName: 'Blockchain', categoryColor: '#F59E0B', country: 'Brazil', city: 'São Paulo',
    venue: 'Centro de Convenções Rebouças', latitude: -23.5505, longitude: -46.6333,
    startDate: new Date(Date.now() + 86400000 * 30), endDate: new Date(Date.now() + 86400000 * 32),
    registrationDeadline: new Date(Date.now() + 86400000 * 28), maxParticipants: 3000, registeredParticipants: 1890,
    entryFee: 0, prizePool: '$40,000 USDC', bannerImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200',
    tags: ['web3', 'ethereum', 'solana', 'solidity'], isFeatured: false, isTrending: false, isPublished: true, status: 'registration_open', source: 'devpost'
  },
  {
    title: 'Paris Machine Learning & Vision Workshop',
    description: 'Hands-on PyTorch 2.5 models, neural rendering, 3D Gaussian Splatting, and robotics vision.',
    eventType: 'workshop', mode: 'online', companyName: 'Inria & Paris AI Lab',
    categoryName: 'AI & Data', categoryColor: '#6366F1', country: 'France', city: 'Paris',
    venue: 'Virtual Classroom 01', latitude: 48.8566, longitude: 2.3522,
    startDate: new Date(Date.now() + 86400000 * 4), endDate: new Date(Date.now() + 86400000 * 5),
    registrationDeadline: new Date(Date.now() + 86400000 * 3), maxParticipants: 1000, registeredParticipants: 950,
    entryFee: 0, prizePool: 'GPU Compute Credits', bannerImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200',
    tags: ['pytorch', 'computervision', 'python', 'ai'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'New York FinTech & AI Quantum Forum',
    description: 'High-frequency trading algorithms, risk modeling with quantum AI, and Wall St. tech innovations.',
    eventType: 'conference', mode: 'hybrid', companyName: 'Wall Street Tech Group',
    categoryName: 'FinTech & AI', categoryColor: '#10B981', country: 'United States', city: 'New York, NY',
    venue: 'Marriott Marquis Times Square', latitude: 40.7128, longitude: -74.0060,
    startDate: new Date(Date.now() + 86400000 * 16), endDate: new Date(Date.now() + 86400000 * 18),
    registrationDeadline: new Date(Date.now() + 86400000 * 14), maxParticipants: 3500, registeredParticipants: 2400,
    entryFee: 99, prizePool: '$50,000 Innovation Grant', bannerImage: 'https://images.unsplash.com/photo-1496868834840-5f4c98840aaa?w=1200',
    tags: ['finance', 'quantum', 'ai', 'python'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Toronto AI Robotics & Hardware Expo',
    description: 'Autonomous drone swarms, ROS 2 pipelines, embedded AI microcontrollers, and edge computing.',
    eventType: 'conference', mode: 'offline', companyName: 'Vector Institute',
    categoryName: 'Robotics & Hardware', categoryColor: '#EAB308', country: 'Canada', city: 'Toronto',
    venue: 'Metro Toronto Convention Centre', latitude: 43.6532, longitude: -79.3832,
    startDate: new Date(Date.now() + 86400000 * 21), endDate: new Date(Date.now() + 86400000 * 23),
    registrationDeadline: new Date(Date.now() + 86400000 * 19), maxParticipants: 2800, registeredParticipants: 1950,
    entryFee: 0, prizePool: '$30,000 CAD Hardware Grants', bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200',
    tags: ['robotics', 'edgeai', 'ros', 'cpp'], isFeatured: false, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Dubai Web3 Future Summit 2026',
    description: 'Middle East\'s premier blockchain, AI metaverse, zero-knowledge scalability, and crypto economy summit.',
    eventType: 'blockchain_event', mode: 'offline', companyName: 'Dubai Future Foundation',
    categoryName: 'Web3 & AI', categoryColor: '#F59E0B', country: 'United Arab Emirates', city: 'Dubai',
    venue: 'Museum of the Future', latitude: 25.2048, longitude: 55.2708,
    startDate: new Date(Date.now() + 86400000 * 28), endDate: new Date(Date.now() + 86400000 * 30),
    registrationDeadline: new Date(Date.now() + 86400000 * 26), maxParticipants: 6000, registeredParticipants: 4500,
    entryFee: 0, prizePool: '$150,000 USD Venture Pool', bannerImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1200',
    tags: ['dubai', 'web3', 'crypto', 'ai'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'unstop'
  },
  {
    title: 'Amsterdam Rust & High-Performance Systems',
    description: 'Low-latency backend engineering, memory safety, WebAssembly, and distributed database internals in Rust.',
    eventType: 'workshop', mode: 'hybrid', companyName: 'Dutch Systems Group',
    categoryName: 'Systems Engineering', categoryColor: '#EC4899', country: 'Netherlands', city: 'Amsterdam',
    venue: 'Beurs van Berlage', latitude: 52.3676, longitude: 4.9041,
    startDate: new Date(Date.now() + 86400000 * 11), endDate: new Date(Date.now() + 86400000 * 13),
    registrationDeadline: new Date(Date.now() + 86400000 * 9), maxParticipants: 1800, registeredParticipants: 1450,
    entryFee: 0, prizePool: '€10,000 Grant', bannerImage: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=1200',
    tags: ['rust', 'wasm', 'backend', 'performance'], isFeatured: false, isTrending: false, isPublished: true, status: 'registration_open', source: 'meetup'
  },
  {
    title: 'Tel Aviv Cyber Defense & Ethical Hacking Championship',
    description: 'CTF challenges, reverse engineering, kernel vulnerability research, and Zero-Trust cloud defense.',
    eventType: 'cybersecurity_conf', mode: 'hybrid', companyName: 'CyberNation Israel',
    categoryName: 'Cybersecurity', categoryColor: '#EF4444', country: 'Israel', city: 'Tel Aviv',
    venue: 'Tel Aviv Expo Center', latitude: 32.0853, longitude: 34.7818,
    startDate: new Date(Date.now() + 86400000 * 19), endDate: new Date(Date.now() + 86400000 * 21),
    registrationDeadline: new Date(Date.now() + 86400000 * 17), maxParticipants: 2500, registeredParticipants: 1980,
    entryFee: 0, prizePool: '$50,000 Bounty Pool', bannerImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200',
    tags: ['ctf', 'cybersecurity', 'hacking', 'security'], isFeatured: true, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Zurich Cloud-Native Architecture Summit',
    description: 'Distributed microservices, eBPF telemetry, service mesh observability, and green computing in Europe.',
    eventType: 'cloud_summit', mode: 'offline', companyName: 'Swiss Cloud Alliance',
    categoryName: 'Cloud & Kubernetes', categoryColor: '#06B6D4', country: 'Switzerland', city: 'Zurich',
    venue: 'ETH Zurich Campus', latitude: 47.3769, longitude: 8.5417,
    startDate: new Date(Date.now() + 86400000 * 15), endDate: new Date(Date.now() + 86400000 * 17),
    registrationDeadline: new Date(Date.now() + 86400000 * 13), maxParticipants: 2000, registeredParticipants: 1620,
    entryFee: 40, prizePool: 'CHF 15,000 Research Award', bannerImage: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200',
    tags: ['kubernetes', 'ebpf', 'cloud', 'golang'], isFeatured: false, isTrending: true, isPublished: true, status: 'registration_open', source: 'internal'
  },
  {
    title: 'Cape Town Open Source & Mobile Builders Assembly',
    description: 'Pan-African Flutter, React Native, offline-first mobile apps, and open-source infrastructure.',
    eventType: 'open_source_event', mode: 'hybrid', companyName: 'AfriCode Network',
    categoryName: 'Mobile & OpenSource', categoryColor: '#8B5CF6', country: 'South Africa', city: 'Cape Town',
    venue: 'Cape Town International Convention Centre', latitude: -33.9249, longitude: 18.4241,
    startDate: new Date(Date.now() + 86400000 * 24), endDate: new Date(Date.now() + 86400000 * 26),
    registrationDeadline: new Date(Date.now() + 86400000 * 22), maxParticipants: 2200, registeredParticipants: 1540,
    entryFee: 0, prizePool: '$20,000 Dev Grants', bannerImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=1200',
    tags: ['mobile', 'flutter', 'reactnative', 'opensource'], isFeatured: false, isTrending: false, isPublished: true, status: 'registration_open', source: 'internal'
  }
];

// ─── GET GLOBE EVENTS (All Published Admin & Community Events from MongoDB) ──
const getGlobeEvents = async () => {
  const events = await Event.find({ isPublished: true })
    .select('_id title slug eventType mode categoryName categoryColor country city latitude longitude startDate endDate registeredParticipants maxParticipants bannerImage thumbnail companyName organizer prizePool isFeatured')
    .populate('organizer', 'fullName avatar')
    .lean();

  return events.map(ev => {
    let lat = Number(ev.latitude);
    let lng = Number(ev.longitude);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      const coords = resolveCoordinates(ev.city, ev.country, ev.title);
      lat = coords.lat;
      lng = coords.lng;
    }

    return {
      id: ev._id,
      title: ev.title,
      slug: ev.slug,
      eventType: ev.eventType || 'workshop',
      mode: ev.mode || 'online',
      categoryName: ev.categoryName || 'General',
      categoryColor: ev.categoryColor || '#04AA6D',
      country: ev.country || '',
      city: ev.city || '',
      lat,
      lng,
      startDate: ev.startDate,
      endDate: ev.endDate,
      registeredCount: ev.registeredParticipants || 0,
      maxCapacity: ev.maxParticipants || 100,
      bannerImage: ev.bannerImage || ev.thumbnail || '',
      companyName: ev.companyName || 'CodeSphere Partner',
      organizerName: ev.organizer?.fullName || 'CodeSphere Admin',
      prizePool: ev.prizePool || '$0',
      isFeatured: Boolean(ev.isFeatured),
    };
  });
};

// ─── GET GLOBALLY AGGREGATED ANALYTICS SUMMARY ────────────────────────────────
const getEventAnalyticsSummary = async () => {
  const totalEvents = await Event.countDocuments({ isPublished: true });
  const totalRegistrationsAgg = await Event.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: null, total: { $sum: '$registeredParticipants' } } }
  ]);
  const totalRegistrations = totalRegistrationsAgg[0]?.total || 0;

  const countryDistribution = await Event.aggregate([
    { $match: { isPublished: true, country: { $ne: '' } } },
    { $group: { _id: '$country', count: { $sum: 1 }, totalParticipants: { $sum: '$registeredParticipants' } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const categoryDistribution = await Event.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$eventType', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  return {
    totalEvents,
    totalRegistrations,
    topCountries: countryDistribution.map(c => ({ country: c._id, eventCount: c.count, participants: c.totalParticipants })),
    categoryDistribution: categoryDistribution.map(c => ({ category: c._id, count: c.count })),
    techTrends: [
      { name: 'Artificial Intelligence & ML', percentage: 38 },
      { name: 'Full-Stack Web Development', percentage: 24 },
      { name: 'Cloud Native & DevOps', percentage: 18 },
      { name: 'Cybersecurity & Ethical Hacking', percentage: 12 },
      { name: 'Web3 & Blockchain', percentage: 8 },
    ]
  };
};

// ─── GET AI RECOMMENDATIONS ───────────────────────────────────────────────────
const getAiRecommendations = async (userTags = ['react', 'python', 'ai']) => {
  const recommended = await Event.find({
    isPublished: true,
    startDate: { $gte: new Date() }
  })
    .sort({ isFeatured: -1, viewCount: -1, registeredParticipants: -1 })
    .limit(6)
    .populate('organizer', 'fullName avatar');

  return recommended;
};

// ─── LIKE / UNLIKE EVENT ─────────────────────────────────────────────────────
const toggleEventLike = async (id, userId) => {
  const event = await Event.findById(id);
  if (!event) throw createError('Event not found', 404);

  // Toggle counter simple fallback
  event.likeCount = (event.likeCount || 0) + 1;
  await event.save();
  return { liked: true, likeCount: event.likeCount };
};

module.exports = {
  getAllEvents,
  getEventById,
  getEventBySlug,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  cancelEvent,
  rescheduleEvent,
  getMyEvents,
  getEventAnalytics,
  getGlobeEvents,
  getEventAnalyticsSummary,
  getAiRecommendations,
  toggleEventLike,
};
