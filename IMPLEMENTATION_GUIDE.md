# CodeSphere Production Implementation Guide

This document outlines all the implementations added to make CodeSphere production-ready.

---

## 📋 Table of Contents

1. [Priority 1: Judge0 Integration](#priority-1-judge0-integration)
2. [Priority 2: Testing & Quality](#priority-2-testing--quality)
3. [Priority 3: Advanced Features](#priority-3-advanced-features)
4. [Environment Setup](#environment-setup)
5. [Deployment Instructions](#deployment-instructions)

---

## Priority 1: Judge0 Integration

### Overview
Replaced client-side mock code compilation with real Judge0 API integration for executing user code in multiple programming languages.

### Files Created/Modified

#### `/server/services/judge0.service.js`
- **Purpose**: Core service for Judge0 API integration
- **Features**:
  - Supports 9 programming languages (JavaScript, Python, Java, C++, C, C#, PHP, Ruby, Go)
  - Automatic fallback to mock results if API key not configured
  - Code syntax validation
  - Test case execution
  - Configurable execution timeouts

#### `/server/controllers/codeExecution.controller.js`
- **Purpose**: HTTP request handlers for code execution
- **Endpoints**:
  - `POST /api/execute/run` - Execute any code snippet
  - `POST /api/execute/sandbox/:projectId/:stepId` - Execute code with test cases
  - `GET /api/execute/languages` - Get supported languages
  - `GET /api/execute/status/:token` - Check execution status

#### `/server/routes/codeExecution.routes.js`
- **Purpose**: Route definitions with rate limiting
- **Rate Limit**: 10 requests/minute per user (prevents abuse)

### Configuration

1. **Set Environment Variables** in `.env`:
```bash
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_api_key_here
JUDGE0_HOST=judge0-ce.p.rapidapi.com
```

2. **Get Judge0 API Key**:
   - Visit [Judge0 RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce)
   - Subscribe to free or paid plan
   - Copy API key to `.env`

### Usage Example

```javascript
// Client-side
const response = await fetch('/api/execute/run', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    code: 'console.log("Hello, World!");',
    language: 'javascript'
  })
});
```

---

## Priority 2: Testing & Quality

### Test Framework Setup

#### Jest Configuration (`/server/jest.config.js`)
- 60% coverage threshold
- Node.js test environment
- 30s timeout per test

#### Test Structure
```
/server/tests/
├── setup.js                    # Global setup
├── services/
│   └── judge0.service.test.js  # Service unit tests
└── controllers/
    └── codeExecution.controller.test.js  # Controller integration tests
```

### Running Tests

```bash
cd server

# Run all tests
npm test

# Watch mode (re-run on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- **judge0.service.test.js**: Tests language mapping, code validation, execution
- **codeExecution.controller.test.js**: Tests API endpoints, authentication, rate limiting

### Key Testing Patterns

1. **Unit Tests**: Service functions in isolation
2. **Integration Tests**: Full HTTP request/response cycle
3. **Mocking**: External APIs mocked using Jest
4. **Database Tests**: MongoDB connection with test database

---

## CI/CD Pipeline

### GitHub Actions Setup (`.github/workflows/ci-cd.yml`)

**Workflow Stages**:

1. **Lint** (Node 18.x & 20.x)
   - ESLint checks for code quality
   - Runs on all branches

2. **Test**
   - MongoDB test container
   - Jest test suite with coverage
   - Codecov integration

3. **Build**
   - Production build for client and server
   - Artifact upload (30 days retention)

4. **Docker Build & Push**
   - Only on main branch
   - Builds Docker images for both services
   - Pushes to GitHub Container Registry

5. **Security Scanning**
   - Trivy vulnerability scanner
   - SARIF upload to GitHub

6. **Deploy to Staging**
   - Triggered on develop branch
   - Custom deployment scripts

### Running Locally

```bash
# Create test environment
cp .env.example .env.test

# Run tests (mimics CI)
npm test

# Check linting
npm run lint
```

---

## Environment Configuration

### `/server/.env.example`

Comprehensive environment configuration covering:

```
Server Configuration
├── NODE_ENV, PORT, HOST
├── Database
│   ├── MONGO_URI (development)
│   └── MONGO_URI_PROD (production)
├── Authentication
│   ├── JWT_SECRET
│   ├── JWT_REFRESH_SECRET
│   └── Expiration times
├── Judge0 Code Execution
│   ├── JUDGE0_API_URL
│   ├── JUDGE0_API_KEY
│   └── JUDGE0_HOST
├── Redis (for real-time & caching)
│   └── REDIS_URL, UPSTASH_REDIS_URL
├── Email Services
│   ├── Gmail, SendGrid, AWS SES, Resend
├── Payment (Stripe)
│   ├── Stripe keys & webhook secret
├── File Storage (AWS S3)
│   ├── AWS credentials & bucket
├── Video Streaming (Agora/LiveKit)
│   └── API keys
├── Monitoring
│   ├── Sentry DSN, Datadog API Key, LOG_LEVEL
├── CORS & Rate Limiting
│   ├── CLIENT_URL, ALLOWED_ORIGINS
│   └── RATE_LIMIT_* settings
├── Feature Flags
│   └── ENABLE_JUDGE0, ENABLE_VIDEO_STREAMING, etc.
└── OAuth
    └── Google, GitHub credentials
```

### Setting Up Environments

**Development**:
```bash
NODE_ENV=development
JUDGE0_API_KEY=test_key  # Uses mock results
```

**Staging**:
```bash
NODE_ENV=staging
JUDGE0_API_KEY=staging_key  # Real API with staging data
```

**Production**:
```bash
NODE_ENV=production
JUDGE0_API_KEY=prod_key  # Real API
```

---

## Rate Limiting & DDoS Protection

### Implementation (`/server/middlewares/rateLimit.middleware.js`)

**Rate Limit Tiers**:

| Endpoint Type | Limit | Window |
|--------------|-------|--------|
| General API | 100 req | 15 min |
| Authentication | 5 attempts | 15 min |
| Code Execution | 10 req | 1 min |
| File Upload | 20 uploads | 1 hour |
| Payment | 5 attempts | 1 hour |

**Features**:
- Redis-backed distributed limiting (multi-instance support)
- In-memory fallback if Redis unavailable
- User-based limits for authenticated requests
- IP-based limits for public endpoints
- Health check bypass

### Usage

```javascript
const { authLimiter, codeLimiter } = require('./middlewares/rateLimit.middleware');

app.post('/auth/login', authLimiter, loginHandler);
app.post('/execute/run', codeLimiter, executeHandler);
```

---

## Database Indexing for Performance

### Index Configuration (`/server/config/indexes.js`)

**Indexes Created**:

| Model | Fields | Purpose |
|-------|--------|---------|
| User | email, username | Unique lookups |
| SandboxProject | instructor+createdAt, category+difficulty, title+tags (text) | Filtering & search |
| SandboxProgress | projectId+userId (unique), userId+status | User progress tracking |
| SandboxSubmission | projectId+userId, status | Submission queries |
| Session | instructor+createdAt, status+startTime | Session queries |
| Payment | userId+createdAt, status, transactionId (unique) | Payment history |
| Notification | userId+read+createdAt, type | Notification feeds |

### Applying Indexes

```javascript
const { createIndexes } = require('./config/indexes');

// In server startup
await createIndexes();
```

---

## Monitoring & Error Tracking

### Sentry Integration (`/server/config/monitoring.js`)

**Setup**:

1. Create account at [sentry.io](https://sentry.io)
2. Get DSN from project settings
3. Set environment variable:
```bash
SENTRY_DSN=https://key@sentry.io/project-id
```

**Features**:
- Automatic error tracking
- Performance monitoring (20% sample rate in prod)
- JavaScript source maps
- Release tracking
- Alert rules for critical errors

**Usage in Code**:
```javascript
const Sentry = require('@sentry/node');
Sentry.captureException(error);
```

### Health Check Endpoint

```bash
GET /health

Response:
{
  "status": "healthy",
  "timestamp": "2024-07-25T10:30:00Z",
  "uptime": 3600,
  "database": "connected",
  "memory": {
    "heapUsed": "45 MB",
    "heapTotal": "128 MB",
    "rss": "250 MB"
  },
  "environment": "production"
}
```

---

## API Documentation

### Swagger/OpenAPI Setup

**Access**: `http://localhost:5000/api-docs`

**Features**:
- Interactive API explorer
- Request/response examples
- Authorization testing
- Download OpenAPI spec

### Example Endpoint Documentation

```javascript
/**
 * @swagger
 * /api/execute/run:
 *   post:
 *     summary: Execute code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CodeExecution'
 *     responses:
 *       200:
 *         description: Code executed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExecutionResult'
 */
```

---

## Performance Optimization & Caching

### Redis Cache Layer (`/server/config/cache.js`)

**Features**:
- Distributed caching across instances
- Automatic TTL management
- In-memory fallback
- Cache middleware for GET requests

**Common Cache Keys**:
```javascript
const { cacheKeys } = require('./config/cache');

cacheKeys.SANDBOX_PROJECTS        // All projects
cacheKeys.SANDBOX_PROJECT(id)     // Specific project
cacheKeys.USER_PROGRESS(uid, pid) // User progress
cacheKeys.LANGUAGES               // Supported languages
```

**Usage Example**:
```javascript
const cache = require('./config/cache');

// Get cached value
const projects = await cache.get('projects:all');

// Set cache (1 hour TTL)
await cache.set('projects:all', projectData, 3600);

// Use middleware
app.get('/api/projects', cache.cacheMiddleware(3600), getProjects);
```

---

## Security Enhancements

### Implemented Security Features

1. **Helmet.js** - HTTP security headers
2. **CORS** - Configurable cross-origin access
3. **Rate Limiting** - Request throttling
4. **Input Validation** - Schema validation
5. **JWT Authentication** - Secure token-based auth
6. **HTTPS Ready** - SSL certificate support

---

## Deployment Instructions

### 1. Pre-Deployment Checklist

```bash
# Copy environment file
cp .env.example .env

# Update .env with production values
nano .env

# Run tests
npm test

# Build client
cd client && npm run build

# Return to server
cd ../server
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Database Setup

```bash
# Create indexes
node -e "const { createIndexes } = require('./config/indexes'); createIndexes().then(() => process.exit(0));"
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

### 5. Docker Deployment

```bash
# Build Docker image
docker build -t codesphere-server .

# Run container
docker run -p 5000:5000 \
  -e MONGO_URI=mongodb://db:27017/codesphere \
  -e JWT_SECRET=your_secret \
  -e JUDGE0_API_KEY=your_key \
  codesphere-server
```

### 6. Verify Deployment

```bash
# Check health
curl http://localhost:5000/health

# Test code execution
curl -X POST http://localhost:5000/api/execute/languages

# Access API docs
open http://localhost:5000/api-docs
```

---

## Troubleshooting

### Common Issues

**Judge0 Returns Mock Results**
- Set `JUDGE0_API_KEY` in `.env`
- Verify API key is valid on RapidAPI dashboard

**Rate Limiting Issues**
- Ensure Redis is running: `redis-cli ping`
- Check `REDIS_URL` in `.env`
- Falls back to memory if Redis unavailable

**Database Connection Failed**
- Verify `MONGO_URI` is correct
- Check MongoDB is running
- For MongoDB Atlas, whitelist IP address

**Tests Fail**
- Ensure MongoDB test instance running
- Check Node version (18.x or 20.x)
- Run `npm install` to update dependencies

---

## Next Steps

### Immediate (Week 1)
- [ ] Set up Judge0 API key
- [ ] Configure environment variables
- [ ] Run tests locally
- [ ] Deploy to staging

### Short Term (Month 1)
- [ ] Integrate video streaming (Agora/LiveKit)
- [ ] Set up AWS S3 for file storage
- [ ] Configure email service
- [ ] Deploy to production

### Medium Term (3 Months)
- [ ] Implement advanced analytics dashboard
- [ ] Set up disaster recovery & backups
- [ ] Add custom domain SSL certificates
- [ ] Performance optimization & load testing

---

## Support & Resources

- **Judge0 Docs**: https://judge0.com/docs
- **Jest Documentation**: https://jestjs.io/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Sentry Documentation**: https://docs.sentry.io/
- **Redis Docs**: https://redis.io/documentation
- **Swagger/OpenAPI**: https://swagger.io/

---

**Last Updated**: July 25, 2024
**Version**: 1.0.0
