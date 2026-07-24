# CodeSphere Quick Start Guide

Get CodeSphere running in 5 minutes with Docker or locally.

---

## 🐳 Option 1: Quick Start with Docker (Recommended)

### Prerequisites
- Docker & Docker Compose installed
- Port 5000, 5173, 27017, 6379 available

### Start Everything

```bash
# Clone or navigate to project
cd Codesphere

# Create environment file
cp server/.env.example server/.env

# Start all services
docker-compose up -d

# Wait for services to be ready (~30s)
docker-compose logs -f server

# Access the application
Frontend: http://localhost:5173
Backend API: http://localhost:5000
API Docs: http://localhost:5000/api-docs
Health Check: http://localhost:5000/health
```

### Stop Everything

```bash
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## 💻 Option 2: Local Development Setup

### Prerequisites
- Node.js 18+ & npm
- MongoDB (local or Atlas)
- Redis (local or Upstash)

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your values
# - MONGO_URI: MongoDB connection string
# - JUDGE0_API_KEY: Get from RapidAPI (optional, uses mock)
# - REDIS_URL: Redis connection string

# Run database indexing
npm run db:index

# Start development server
npm run dev

# In another terminal, run tests
npm test
```

Backend running at: `http://localhost:5000`

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create environment file
cat > .env.development << EOF
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=CodeSphere
VITE_ENVIRONMENT=development
EOF

# Start development server
npm run dev
```

Frontend running at: `http://localhost:5173`

---

## ⚙️ Environment Configuration

### Quick Environment Setup

```bash
# Server .env (basic)
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/codesphere
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key_here
JUDGE0_API_KEY=  # Leave empty to use mock

# For production
NODE_ENV=production
JUDGE0_API_KEY=your_judge0_api_key  # Get from RapidAPI
```

---

## 🚀 Key Features to Test

### 1. Code Execution (Judge0 Integration)

```bash
# Run code via API
curl -X POST http://localhost:5000/api/execute/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "code": "console.log(\"Hello, World!\");",
    "language": "javascript"
  }'

# Get supported languages
curl http://localhost:5000/api/execute/languages
```

### 2. API Documentation

Visit: `http://localhost:5000/api-docs`

Interactive Swagger UI with all endpoints documented.

### 3. Health Monitoring

```bash
curl http://localhost:5000/health
```

Returns:
```json
{
  "status": "healthy",
  "uptime": 3600,
  "database": "connected",
  "memory": { "heapUsed": "45 MB", "heapTotal": "128 MB" }
}
```

### 4. Run Tests

```bash
cd server
npm test              # Run all tests once
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Detailed implementation documentation |
| [API Docs](http://localhost:5000/api-docs) | Interactive Swagger UI |
| [README.md](./README.md) | Project overview |
| [rough_cost_estimation.md](./rough_cost_estimation.md) | Cost analysis & deployment |

---

## 🔧 Useful Commands

### Database

```bash
# Create indexes
npm run db:index

# Drop all indexes (caution!)
npm run db:drop-indexes

# Seed database
npm run db:seed
```

### Testing

```bash
# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- judge0.service.test.js

# Update snapshots
npm test -- -u
```

### Linting

```bash
npm run lint          # Check for issues
npm run lint -- --fix # Auto-fix issues
```

### Docker

```bash
# View logs
docker-compose logs -f server

# Access MongoDB
docker exec -it codesphere-mongodb mongosh -u root -p

# Access Redis
docker exec -it codesphere-redis redis-cli

# Restart services
docker-compose restart server
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for port conflicts
lsof -i :5000
```

### MongoDB connection error
```bash
# Verify MongoDB is running
docker-compose ps mongodb

# Restart MongoDB
docker-compose restart mongodb

# Check connection string in .env
```

### Judge0 returns mock results
- Set `JUDGE0_API_KEY` in `.env`
- Get key from: https://rapidapi.com/judge0-official/api/judge0-ce
- Free tier allows 100 requests/month

### Rate limiting issues
- Ensure Redis is running
- Check `REDIS_URL` in .env
- Clear rate limit cache: `docker-compose exec redis redis-cli FLUSHALL`

### Tests fail
```bash
# Make sure test database is running
docker-compose up -d mongodb

# Run with debug output
npm test -- --verbose

# Reset test database
npm run db:drop-indexes && npm test
```

---

## 📝 Next Steps

1. ✅ **Start the application** (Docker or local)
2. ✅ **Test code execution** via API
3. ✅ **Run the test suite**
4. ✅ **Explore API documentation**
5. ✅ **Configure environment** for your deployment
6. ✅ **Read** [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

---

## 🆘 Need Help?

- **API Issues**: Check `/api-docs` for endpoint details
- **Judge0 Setup**: See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#priority-1-judge0-integration)
- **Testing**: See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#priority-2-testing--quality)
- **Deployment**: See [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md#deployment-instructions)

---

**Ready to launch?** Check out the [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for production deployment steps.
