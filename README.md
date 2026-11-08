# 🚀 CodeSphere

> **Next-Generation Cloud IDE, Real-Time Compiler Playpens, Multiplayer Codex Workspaces, Video Classrooms & 83 Interactive Curricula.**

---

## 🌟 Overview

CodeSphere is an all-in-one developer learning and engineering collaboration platform combining:
- **Web IDE & Compiler Playpens**: Multi-language code execution engine (Python, C++, Java, JS/TS, Bash).
- **Collaborative Codex**: Multiplayer workspaces with live Monaco editor, Yjs CRDT synchronization, integrated Git, terminal, and AI assistance.
- **83 Full Curricula Roadmaps**: Interactive visual tree roadmaps backed by structured learning modules and PDF guides.
- **DSA Interactive Problem Solver**: 446 structured problem sets with hints, theory modules, real-time code runner, and test suites.
- **Live Classroom Sessions**: WebRTC & Google Meet integrated study rooms with real-time screen sharing and chat.
- **Community Guilds & Forums**: Discussion hubs, peer code reviews, resource library, and automated assessment leaderboards.

---

## 📁 Repository Structure

```text
Codesphere/
├── client/                     # React 19 + Vite + Tailwind CSS Frontend Application
│   ├── src/
│   │   ├── features/           # Modular domain features (auth, codex, dsa, learning, admin, etc.)
│   │   ├── components/         # Shared UI components & design system
│   │   ├── layouts/            # Public, Dashboard, Instructor, Admin & Error layouts
│   │   ├── routes/             # AppRoutes, RouteGuard, lazy loading configurations
│   │   └── services/           # Axios apiClient, socket connection, global state
│   └── package.json
│
├── server/                     # Express.js Core REST & WebSocket Backend
│   ├── config/                 # MongoDB, Redis, JWT, Cloudinary & Swagger configs
│   ├── controllers/            # Route controllers for all platform entities
│   ├── middlewares/            # Rate limiting, auth, NoSQL/XSS sanitization, reverse proxy
│   ├── models/                 # Mongoose schema models with compound indexes
│   ├── routes/                 # Express REST endpoint routers
│   ├── socket/                 # Socket.io real-time broadcast and room management
│   └── package.json
│
├── Codesphere-Codex/           # Standalone High-Performance Codex Collaboration Microservice
│   ├── server/                 # TypeScript server with native compiler execution runners
│   └── src/                    # Collaborative IDE components, Yjs CRDT providers & Monaco shim
│
├── docs/                       # Project Documentation, Architecture & Specifications
│   ├── QUICK_START.md          # ⚡ Quick start and local installation guide
│   ├── SETUP_AND_RUN.md        # 🛠️ Detailed step-by-step setup instructions
│   ├── CREDENTIALS.md          # 🔐 Default demo accounts and credentials
│   ├── CODEX_FEATURE_SPECIFICATION.md # 💻 Full Codex IDE specifications
│   ├── db.md                   # 🗄️ Database models, collections, and index schemas
│   ├── db_implement_understanding.md # 🧠 Database design patterns & relations
│   ├── DEPLOYMENT_CHECKLIST.md  # 🚀 Production deployment checklist
│   ├── DISASTER_RECOVERY.md    # 🛡️ Backup strategies and failover procedures
│   ├── PRODUCTION_SUMMARY.md   # 📊 Production infrastructure summary
│   ├── cost.md                 # 💰 Cloud hosting and service cost estimates
│   ├── FILES_CREATED.md        # 📋 Repository asset and file manifests
│   ├── IMPLEMENTATION_GUIDE.md # 📖 Implementation architecture notes
│   ├── till_to_do.md           # 📝 Roadmap and planned feature enhancements
│   ├── VS_CODE_WEB_FEATURE.md  # 🌐 VS Code Web iframe integration specs
│   └── VSCODE_COMPLETE_FEATURES.md # 🧩 Complete feature matrix
│
├── docker-compose.yml          # Local Docker multi-service container orchestration
├── docker-compose.prod.yml     # Production Docker stack configuration
├── nginx.conf                  # Nginx edge reverse proxy configuration
└── README.md                   # Root documentation index
```

---

## ⚡ Quick Start

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher running on `mongodb://127.0.0.1:27017`
- **npm** or **yarn**

### 2. Installation & Running

```bash
# 1. Install dependencies for all packages
cd client && npm install
cd ../server && npm install
cd ../Codesphere-Codex && npm install

# 2. Start the Backend API (Port 5001)
cd server
npm run dev

# 3. Start the Codex Collab Server (Port 4000)
cd Codesphere-Codex
npm run server:dev

# 4. Start the Frontend Dev Server (Port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** to access CodeSphere.

---

## 📚 Documentation Index

All extended documentation has been neatly organized under the [`docs/`](./docs/) directory:

| Document | Description |
| :--- | :--- |
| [**Quick Start Guide**](./docs/QUICK_START.md) | Initial setup, environment variables, and running locally. |
| [**Setup & Run**](./docs/SETUP_AND_RUN.md) | Exhaustive environment instructions and seed script execution. |
| [**Demo Credentials**](./docs/CREDENTIALS.md) | Pre-seeded accounts (Student, Instructor, Admin). |
| [**Database Specification**](./docs/db.md) | MongoDB schemas, validation rules, and compound indexes. |
| [**Codex IDE Specification**](./docs/CODEX_FEATURE_SPECIFICATION.md) | Multiplayer collaboration, Monaco bindings, and terminal engine. |
| [**Production Deployment**](./docs/DEPLOYMENT_CHECKLIST.md) | SSL, Nginx edge routing, and Docker orchestration checklist. |
| [**Disaster Recovery**](./docs/DISASTER_RECOVERY.md) | Automated MongoDB backups, health monitoring, and recovery runbook. |
| [**Cost Estimation**](./docs/cost.md) | Infrastructure hosting, bandwidth, and resource cost projections. |

---

## 🛡️ License

Built with ❤️ for engineering teams and developer communities.
