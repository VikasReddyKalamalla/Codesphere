/**
 * Native Roadmaps Data
 * Analyzed and transformed from official roadmap.sh structures into CodeSphere's native format.
 */

export const NATIVE_ROADMAPS = [
  {
    id: 'frontend',
    title: 'Frontend Developer Roadmap',
    category: 'Web Development',
    difficulty: 'beginner',
    description: 'Master modern frontend engineering: HTML, CSS, JavaScript, React, Next.js, state management, web performance, and browser APIs.',
    duration: 180, // hours
    modules: [
      {
        _id: 'fe-mod-1',
        order: 1,
        title: 'Internet & Web Fundamentals',
        description: 'Understand how the web works, HTTP/HTTPS protocols, DNS, domain names, hosting, browsers, and client-server architecture.',
        topics: ['How DNS Works', 'HTTP/HTTPS & Status Codes', 'Browsers & Rendering Engine', 'Domain & Web Hosting'],
        lessons: [
          { _id: 'fe-l-1', title: 'How the Web & HTTP Protocol Work', type: 'article', duration: 20 },
          { _id: 'fe-l-2', title: 'DNS Resolution & IP Routing Breakdown', type: 'video', duration: 25 },
          { _id: 'fe-l-3', title: 'Browser Rendering Engine & Critical Path', type: 'code', duration: 30 },
        ]
      },
      {
        _id: 'fe-mod-2',
        order: 2,
        title: 'HTML & Semantic Web',
        description: 'Master HTML5 semantic elements, forms & validation, accessibility (a11y), SEO basics, and web standards.',
        topics: ['Semantic Elements', 'Forms & Inputs', 'Accessibility & WAI-ARIA', 'SEO Best Practices'],
        lessons: [
          { _id: 'fe-l-4', title: 'Semantic HTML5 & Accessible Structure', type: 'article', duration: 25 },
          { _id: 'fe-l-5', title: 'Form Controls & Custom Validation', type: 'code', duration: 35 },
          { _id: 'fe-l-6', title: 'WAI-ARIA & Screen Reader Compatibility', type: 'video', duration: 30 },
        ]
      },
      {
        _id: 'fe-mod-3',
        order: 3,
        title: 'CSS & Modern Responsive Design',
        description: 'Master CSS fundamentals, Flexbox, CSS Grid, animations, CSS variables, TailwindCSS, and responsive layouts.',
        topics: ['Box Model & Positioning', 'Flexbox & CSS Grid', 'Responsive Breakpoints', 'TailwindCSS & Utilities', 'Animations & Transitions'],
        lessons: [
          { _id: 'fe-l-7', title: 'Deep Dive: Box Model & Stacking Context', type: 'article', duration: 30 },
          { _id: 'fe-l-8', title: 'Flexbox vs CSS Grid Architecture', type: 'code', duration: 40 },
          { _id: 'fe-l-9', title: 'Building Fluid Responsive Interfaces', type: 'video', duration: 35 },
        ]
      },
      {
        _id: 'fe-mod-4',
        order: 4,
        title: 'JavaScript Deep Dive (ES6+)',
        description: 'Core JS, DOM manipulation, Async/Await, Promises, Event Loop, Closures, Prototypes, and Modules.',
        topics: ['Scope & Closures', 'Event Loop & Promises', 'Async/Await & Fetch API', 'DOM Manipulation', 'ES6+ Syntax'],
        lessons: [
          { _id: 'fe-l-10', title: 'JS Engine, Call Stack & Event Loop', type: 'video', duration: 45 },
          { _id: 'fe-l-11', title: 'Mastering Promises & Async Control Flow', type: 'code', duration: 40 },
          { _id: 'fe-l-12', title: 'Closures & Functional Programming Patterns', type: 'article', duration: 35 },
        ]
      },
      {
        _id: 'fe-mod-5',
        order: 5,
        title: 'Version Control & Git',
        description: 'Git CLI workflows, branching strategies, rebasing, pull requests, merge conflict resolution, and GitHub Actions.',
        topics: ['Git Basics & Commits', 'Branching & Merging', 'Rebase vs Merge', 'GitHub Collaboration PRs'],
        lessons: [
          { _id: 'fe-l-13', title: 'Git Branching & Rebase Workflow', type: 'code', duration: 30 },
          { _id: 'fe-l-14', title: 'Resolving Merge Conflicts Like a Pro', type: 'video', duration: 25 },
        ]
      },
      {
        _id: 'fe-mod-6',
        order: 6,
        title: 'Package Managers & Build Tools',
        description: 'npm, yarn, pnpm, Vite, Webpack, Babel, ESBuild, and asset bundling.',
        topics: ['npm & Package Scripts', 'Vite & HMR', 'Webpack & Asset Bundling', 'Transpilers & Babel'],
        lessons: [
          { _id: 'fe-l-15', title: 'Understanding Package Managers & Lockfiles', type: 'article', duration: 20 },
          { _id: 'fe-l-16', title: 'Vite Architecture & Fast Dev Server', type: 'code', duration: 30 },
        ]
      },
      {
        _id: 'fe-mod-7',
        order: 7,
        title: 'Frontend Frameworks: React & Ecosystem',
        description: 'JSX, Components, Props, State, React Hooks (useState, useEffect, useMemo, useCallback), Context API, React Query.',
        topics: ['JSX & Components', 'React Hooks Masterclass', 'State Management & Context API', 'Custom Hooks', 'TanStack Query'],
        lessons: [
          { _id: 'fe-l-17', title: 'React Virtual DOM & Reconciliation', type: 'article', duration: 35 },
          { _id: 'fe-l-18', title: 'Advanced React Hooks Patterns', type: 'code', duration: 50 },
          { _id: 'fe-l-19', title: 'Global State: Context vs Redux Toolkit', type: 'code', duration: 45 },
        ]
      },
      {
        _id: 'fe-mod-8',
        order: 8,
        title: 'Web Performance & Security',
        description: 'Core Web Vitals, Lighthouse auditing, code splitting, memoization, CORS, XSS, CSRF, CSP headers, and SSR with Next.js.',
        topics: ['Core Web Vitals (LCP, FID, CLS)', 'Code Splitting & Lazy Loading', 'XSS & CSRF Prevention', 'Next.js App Router SSR'],
        lessons: [
          { _id: 'fe-l-20', title: 'Optimizing Core Web Vitals & Lighthouse Scores', type: 'video', duration: 40 },
          { _id: 'fe-l-21', title: 'Securing Web Applications Against OWASP Top 10', type: 'article', duration: 35 },
        ]
      }
    ]
  },

  {
    id: 'backend',
    title: 'Backend Developer Roadmap',
    category: 'Backend',
    difficulty: 'intermediate',
    description: 'Master scalable backend engineering: Node.js, Python, Databases (SQL & NoSQL), REST APIs, GraphQL, Caching, Microservices, and Auth.',
    duration: 220,
    modules: [
      {
        _id: 'be-mod-1',
        order: 1,
        title: 'Backend Runtimes & Languages',
        description: 'Choose and master runtimes: Node.js (V8 event loop), Python (Asyncio), Go, or Java (JVM concurrency).',
        topics: ['Node.js Event Loop', 'Python Asyncio', 'Go Goroutines', 'Java JVM Memory'],
        lessons: [
          { _id: 'be-l-1', title: 'Node.js Non-Blocking I/O Architecture', type: 'video', duration: 35 },
          { _id: 'be-l-2', title: 'Concurrency & Thread Pool Execution', type: 'article', duration: 30 },
        ]
      },
      {
        _id: 'be-mod-2',
        order: 2,
        title: 'Relational Databases (SQL)',
        description: 'PostgreSQL, MySQL, Schema Design, Normalization, ACID Properties, Indexing strategies (B-Trees), Queries & Joins.',
        topics: ['PostgreSQL Schema Design', 'ACID Transactions', 'B-Tree & Hash Indexing', 'SQL Query Optimization'],
        lessons: [
          { _id: 'be-l-3', title: 'Designing High-Performance Relational Schemas', type: 'code', duration: 45 },
          { _id: 'be-l-4', title: 'Database Indexing & Query Planner Analysis', type: 'article', duration: 40 },
        ]
      },
      {
        _id: 'be-mod-3',
        order: 3,
        title: 'NoSQL Databases & Document Stores',
        description: 'MongoDB, Redis, DynamoDB, Document Modeling, Sharding, Replication, and Caching Patterns.',
        topics: ['MongoDB Aggregations', 'Redis Caching Strategies', 'Data Replication & CAP Theorem', 'Sharding & Clustering'],
        lessons: [
          { _id: 'be-l-5', title: 'Redis Cache-Aside, Write-Through & Eviction', type: 'code', duration: 40 },
          { _id: 'be-l-6', title: 'MongoDB Document Modeling Best Practices', type: 'video', duration: 35 },
        ]
      },
      {
        _id: 'be-mod-4',
        order: 4,
        title: 'REST API Architecture & Design',
        description: 'REST principles, HTTP methods, status codes, payload validation, pagination, filtering, rate limiting, and OpenAPI specs.',
        topics: ['REST Principles', 'Rate Limiting & Throttling', 'OpenAPI / Swagger Specs', 'Idempotency & Middleware'],
        lessons: [
          { _id: 'be-l-7', title: 'Building Production REST APIs with Express/Fastify', type: 'code', duration: 50 },
          { _id: 'be-l-8', title: 'Rate Limiting Middleware & Sliding Window Algorithm', type: 'code', duration: 35 },
        ]
      },
      {
        _id: 'be-mod-5',
        order: 5,
        title: 'Authentication & Authorization (Security)',
        description: 'JWT tokens, OAuth 2.0, OpenID Connect, Session cookies, Passwords hashing (bcrypt/Argon2), RBAC & ABAC permission controls.',
        topics: ['JWT Access & Refresh Tokens', 'OAuth 2.0 Authorization Code Flow', 'Bcrypt/Argon2 Password Hashing', 'RBAC Middleware'],
        lessons: [
          { _id: 'be-l-9', title: 'Stateless Auth with Access & Refresh Tokens', type: 'code', duration: 45 },
          { _id: 'be-l-10', title: 'OAuth 2.0 & Google/GitHub Sign-In Integration', type: 'video', duration: 40 },
        ]
      },
      {
        _id: 'be-mod-6',
        order: 6,
        title: 'Message Queues & Microservices',
        description: 'Event-driven architecture, RabbitMQ, Apache Kafka, Pub/Sub, Worker Queues, Service Discovery, gRPC.',
        topics: ['Message Queues (RabbitMQ/BullMQ)', 'Kafka Event Streaming', 'gRPC & Protocol Buffers', 'Microservices vs Monolith'],
        lessons: [
          { _id: 'be-l-11', title: 'Asynchronous Background Workers with Redis BullMQ', type: 'code', duration: 45 },
          { _id: 'be-l-12', title: 'Event-Driven Architecture & Kafka Pub/Sub', type: 'article', duration: 40 },
        ]
      }
    ]
  },

  {
    id: 'ai-engineer',
    title: 'AI & LLM Engineer Roadmap',
    category: 'Data Science',
    difficulty: 'advanced',
    description: 'Master Artificial Intelligence engineering: Python, PyTorch, LLMs (Gemini, OpenAI), RAG (Retrieval-Augmented Generation), Vector DBs (Pinecone, Chroma), LangChain, Fine-tuning, and Agentic Systems.',
    duration: 250,
    modules: [
      {
        _id: 'ai-mod-1',
        order: 1,
        title: 'Python for AI & Math Foundations',
        description: 'NumPy, Pandas, Vector Algebra, Probability, Statistics, Matrix Multiplication, and Gradient Descent.',
        topics: ['NumPy Vectorization', 'Pandas Data Wrangling', 'Linear Algebra & Tensors', 'Gradient Descent & Calculus'],
        lessons: [
          { _id: 'ai-l-1', title: 'High-Performance NumPy Matrix Operations', type: 'code', duration: 40 },
          { _id: 'ai-l-2', title: 'Mathematical Foundations of Neural Networks', type: 'article', duration: 45 },
        ]
      },
      {
        _id: 'ai-mod-2',
        order: 2,
        title: 'Deep Learning & Transformer Architecture',
        description: 'Neural Networks, Backpropagation, PyTorch, Attention Mechanism (Self-Attention, Multi-Head Attention), Transformers.',
        topics: ['PyTorch Tensors & Autograd', 'Self-Attention Mechanism', 'Transformer Encoder-Decoder Architecture', 'Positional Embeddings'],
        lessons: [
          { _id: 'ai-l-3', title: 'Building a Transformer Model from Scratch in PyTorch', type: 'code', duration: 60 },
          { _id: 'ai-l-4', title: 'Understanding Attention: Scaled Dot-Product Attention', type: 'video', duration: 45 },
        ]
      },
      {
        _id: 'ai-mod-3',
        order: 3,
        title: 'Large Language Models & API Integration',
        description: 'Gemini 1.5/2.0 API, OpenAI GPT-4, Anthropic Claude, Prompt Engineering, System Prompts, Structured JSON Outputs, Function Calling.',
        topics: ['Gemini API & Firebase AI Logic', 'Prompt Engineering Patterns', 'Structured JSON Output Generation', 'Function Calling & Tools'],
        lessons: [
          { _id: 'ai-l-5', title: 'Integrating Gemini AI API with Multimodal Inputs', type: 'code', duration: 40 },
          { _id: 'ai-l-6', title: 'Function Calling & Native Tool Execution', type: 'code', duration: 45 },
        ]
      },
      {
        _id: 'ai-mod-4',
        order: 4,
        title: 'Retrieval-Augmented Generation (RAG)',
        description: 'Embeddings models, Vector Databases (ChromaDB, Pinecone, Qdrant), Text Chunking, Hybrid Search, BM25 + Vector Reranking.',
        topics: ['Text Embeddings (OpenAI/Google)', 'Vector Databases & Similarity Search', 'Chunking Strategies (Recursive/Semantic)', 'Reranking & HyDE RAG'],
        lessons: [
          { _id: 'ai-l-7', title: 'Building an End-to-End RAG Pipeline with ChromaDB', type: 'code', duration: 50 },
          { _id: 'ai-l-8', title: 'Advanced RAG: Context Precision & Semantic Reranking', type: 'article', duration: 40 },
        ]
      },
      {
        _id: 'ai-mod-5',
        order: 5,
        title: 'Autonomous AI Agents & Multi-Agent Orchestration',
        description: 'LangChain, LangGraph, AutoGen, Agent Memory, Tool Calling Loops, ReAct (Reasoning + Acting) Framework, Planning Agents.',
        topics: ['ReAct Prompting Pattern', 'LangGraph Stateful Workflows', 'Multi-Agent Teams & Supervision', 'Short & Long-Term Agent Memory'],
        lessons: [
          { _id: 'ai-l-9', title: 'Building an Autonomous AI Coding Agent with LangGraph', type: 'code', duration: 55 },
          { _id: 'ai-l-10', title: 'Multi-Agent Collaboration & Handoff Patterns', type: 'video', duration: 45 },
        ]
      }
    ]
  },

  {
    id: 'devops',
    title: 'DevOps & Cloud Engineer Roadmap',
    category: 'DevOps',
    difficulty: 'intermediate',
    description: 'Master cloud infrastructure: Linux Administration, Docker, Kubernetes, CI/CD Pipelines, Infrastructure as Code (Terraform), AWS/GCP, Monitoring (Prometheus/Grafana).',
    duration: 200,
    modules: [
      {
        _id: 'do-mod-1',
        order: 1,
        title: 'Linux Administration & Shell Scripting',
        description: 'Linux CLI, Systemd services, File Permissions, Bash Scripting, Networking (SSHD, IPTables, Netstat), Cron jobs.',
        topics: ['Linux File Permissions & Users', 'Systemd Service Management', 'Bash Shell Automation', 'Networking (IP, Ports, DNS)'],
        lessons: [
          { _id: 'do-l-1', title: 'Linux CLI Mastery & Systemd Services', type: 'video', duration: 35 },
          { _id: 'do-l-2', title: 'Automating Tasks with Bash Shell Scripts', type: 'code', duration: 40 },
        ]
      },
      {
        _id: 'do-mod-2',
        order: 2,
        title: 'Containerization with Docker',
        description: 'Docker Engine, Images, Containers, Dockerfiles, Multi-stage builds, Docker Compose, Volume persistence, Networking.',
        topics: ['Dockerfile Optimization', 'Multi-Stage Build Production Images', 'Docker Compose Orchestration', 'Volume & Network Driver'],
        lessons: [
          { _id: 'do-l-3', title: 'Writing Production Dockerfiles with Multi-Stage Builds', type: 'code', duration: 40 },
          { _id: 'do-l-4', title: 'Docker Compose Local Stack Provisioning', type: 'code', duration: 35 },
        ]
      },
      {
        _id: 'do-mod-3',
        order: 3,
        title: 'CI/CD Automated Pipelines',
        description: 'GitHub Actions, GitLab CI, Jenkins, Automated Linting & Testing, Container Building, Automated Deployment.',
        topics: ['GitHub Actions Workflows', 'Secrets & Environment Variables', 'Automated Testing & Linting Gates', 'Docker Push to Registry'],
        lessons: [
          { _id: 'do-l-5', title: 'Building a Production GitHub Actions CI/CD Pipeline', type: 'code', duration: 45 },
          { _id: 'do-l-6', title: 'Zero-Downtime Deployment Strategies', type: 'article', duration: 30 },
        ]
      },
      {
        _id: 'do-mod-4',
        order: 4,
        title: 'Container Orchestration: Kubernetes (K8s)',
        description: 'K8s Architecture, Pods, Deployments, Services, Ingress Controllers, ConfigMaps, Secrets, Helm Charts, HPA.',
        topics: ['K8s Pods & Deployments', 'Services & Nginx Ingress', 'Helm Chart Management', 'Horizontal Pod Autoscaling (HPA)'],
        lessons: [
          { _id: 'do-l-7', title: 'Kubernetes Cluster Concepts: Pods, Services & Ingress', type: 'video', duration: 50 },
          { _id: 'do-l-8', title: 'Deploying Microservices to Kubernetes with Helm', type: 'code', duration: 45 },
        ]
      },
      {
        _id: 'do-mod-5',
        order: 5,
        title: 'Infrastructure as Code (Terraform)',
        description: 'HCL Syntax, Providers (AWS/GCP/Azure), Modules, State File Management, Remote Backend, Plan & Apply workflows.',
        topics: ['Terraform HCL Syntax', 'AWS EC2/VPC Provisioning', 'Remote State & Locking (S3 + DynamoDB)', 'Modular Infrastructure'],
        lessons: [
          { _id: 'do-l-9', title: 'Provisioning AWS Cloud Infrastructure with Terraform', type: 'code', duration: 50 },
        ]
      }
    ]
  },

  {
    id: 'software-architect',
    title: 'Software Architect & System Design Roadmap',
    category: 'System Design',
    difficulty: 'advanced',
    description: 'Master large-scale distributed systems: Microservices, High Availability, Load Balancing, Database Sharding, Caching, Event-Driven Systems, API Gateway, Fault Tolerance.',
    duration: 210,
    modules: [
      {
        _id: 'sa-mod-1',
        order: 1,
        title: 'System Design Fundamentals & Scalability',
        description: 'Vertical vs Horizontal Scaling, Latency vs Throughput, Consistency vs Availability (CAP Theorem), PACELC Theorem.',
        topics: ['Horizontal vs Vertical Scaling', 'CAP & PACELC Theorems', 'SLA, SLO & Reliability Metrics', 'Back-of-the-envelope Calculations'],
        lessons: [
          { _id: 'sa-l-1', title: 'Mastering Back-of-the-Envelope Capacity Estimations', type: 'article', duration: 35 },
          { _id: 'sa-l-2', title: 'Trade-offs: Latency, Throughput & Consistency', type: 'video', duration: 40 },
        ]
      },
      {
        _id: 'sa-mod-2',
        order: 2,
        title: 'Load Balancing & Reverse Proxies',
        description: 'Layer 4 vs Layer 7 Load Balancers, Nginx, HAProxy, Consistent Hashing Algorithms, Health Checks, DNS Round-Robin.',
        topics: ['Layer 4 vs Layer 7 Load Balancing', 'Consistent Hashing Algorithm', 'Nginx Reverse Proxy & SSL Termination', 'Sticky Sessions vs Stateless'],
        lessons: [
          { _id: 'sa-l-3', title: 'Consistent Hashing in Distributed Caching & Storage', type: 'code', duration: 45 },
          { _id: 'sa-l-4', title: 'Configuring Nginx for 100K Concurrent WebSockets', type: 'code', duration: 40 },
        ]
      },
      {
        _id: 'sa-mod-3',
        order: 3,
        title: 'Distributed Databases & Partitioning',
        description: 'Database Sharding, Range vs Hash Partitioning, Master-Slave Replication, Multi-Leader Replication, Distributed Transactions (Saga Pattern).',
        topics: ['Database Sharding Strategies', 'Replication Lag & Failover', 'Saga Pattern for Distributed Transactions', 'Two-Phase Commit (2PC)'],
        lessons: [
          { _id: 'sa-l-5', title: 'Sharding Relational Databases at Scale', type: 'article', duration: 45 },
          { _id: 'sa-l-6', title: 'Implementing Saga Orchestration Pattern', type: 'code', duration: 50 },
        ]
      },
      {
        _id: 'sa-mod-4',
        order: 4,
        title: 'Distributed Caching & Message Queues',
        description: 'Redis, Memcached, Cache Invalidation Strategies, Message Broker Architecture (Kafka, Pulsar), Dead Letter Queues.',
        topics: ['Cache Breakdown & Avalanche', 'Kafka Partition Log Architecture', 'Idempotency & Message Deduplication', 'Event Sourcing & CQRS'],
        lessons: [
          { _id: 'sa-l-7', title: 'Event Sourcing & CQRS Architecture Pattern', type: 'video', duration: 50 },
        ]
      }
    ]
  },

  {
    id: 'cyber-security',
    title: 'Cyber Security & Ethical Hacking Roadmap',
    category: 'Security',
    difficulty: 'intermediate',
    description: 'Master security engineering: Network Security, Penetration Testing, OWASP Top 10, Cryptography, Identity & IAM, Red Teaming.',
    duration: 190,
    modules: [
      {
        _id: 'cs-mod-1',
        order: 1,
        title: 'Network Security & Protocols',
        description: 'TCP/IP Model, Wireshark Packet Analysis, Nmap Scanning, Firewalls, VPNs, TLS/SSL Cryptography, DNSSEC.',
        topics: ['TCP/IP & Packet Analysis', 'Nmap Port Scanning', 'TLS 1.3 Handshake & Certificates', 'Firewall Rules & Subnetting'],
        lessons: [
          { _id: 'cs-l-1', title: 'Wireshark Packet Capture & Traffic Analysis', type: 'video', duration: 40 },
          { _id: 'cs-l-2', title: 'TLS 1.3 Cryptographic Handshake Deep Dive', type: 'article', duration: 35 },
        ]
      },
      {
        _id: 'cs-mod-2',
        order: 2,
        title: 'Application Security (OWASP Top 10)',
        description: 'SQL Injection, XSS, CSRF, SSRF, Broken Authentication, IDOR, Security Misconfigurations, API Vulnerabilities.',
        topics: ['SQL Injection Exploitation & Defense', 'Cross-Site Scripting (XSS) Mitigation', 'SSRF & Cloud Metadata Exploitation', 'IDOR Vulnerabilities'],
        lessons: [
          { _id: 'cs-l-3', title: 'Auditing & Fixing OWASP Top 10 Web Vulnerabilities', type: 'code', duration: 50 },
          { _id: 'cs-l-4', title: 'Penetration Testing Web APIs with Burp Suite', type: 'video', duration: 45 },
        ]
      }
    ]
  }
];

export default NATIVE_ROADMAPS;
