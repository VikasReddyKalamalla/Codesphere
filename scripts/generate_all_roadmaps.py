import pypdf
import glob
import os
import json
import re

ROADMAPS_DIR = '/Users/venkatkarthik/Desktop/Codesphere/roadamaps'
OUTPUT_JS = '/Users/venkatkarthik/Desktop/Codesphere/client/src/features/learning/data/nativeRoadmapsData.js'
OUTPUT_JSON = '/Users/venkatkarthik/Desktop/Codesphere/server/data/roadmapsData.json'

# Meta mappings for each roadmap key
META = {
    'ai-agents': {
        'title': 'AI Agents & Multi-Agent Architecture Roadmap',
        'category': 'Data Science',
        'difficulty': 'advanced',
        'description': 'Master autonomous AI agents: ReAct pattern, LangGraph, AutoGen, CrewAI, memory systems, tool calling, and multi-agent coordination.',
        'duration': 220
    },
    'ai-engineer': {
        'title': 'AI & LLM Engineer Roadmap',
        'category': 'Data Science',
        'difficulty': 'advanced',
        'description': 'Master AI engineering: Python, PyTorch, Transformers, LLMs (Gemini, OpenAI), RAG, Vector DBs, Fine-tuning, and LangChain.',
        'duration': 250
    },
    'ai-product-builder': {
        'title': 'AI Product Builder Roadmap',
        'category': 'Data Science',
        'difficulty': 'intermediate',
        'description': 'Build end-to-end AI products: LLM APIs, Vibe Coding, UI design for AI apps, prompt engineering, vector search, and monetization.',
        'duration': 180
    },
    'ai-red-teaming': {
        'title': 'AI Red Teaming & Security Roadmap',
        'category': 'Security',
        'difficulty': 'advanced',
        'description': 'Test and secure AI models: Prompt injection, jailbreaking, model inversion, data poisoning, guardrails, and AI safety evaluation.',
        'duration': 190
    },
    'android': {
        'title': 'Android Developer Roadmap',
        'category': 'Mobile Development',
        'difficulty': 'intermediate',
        'description': 'Master Android app development: Kotlin, Jetpack Compose, Coroutines, Flow, MVVM architecture, Retrofit, Room, and Gradle.',
        'duration': 200
    },
    'backend': {
        'title': 'Backend Developer Roadmap',
        'category': 'Backend',
        'difficulty': 'intermediate',
        'description': 'Master scalable backend engineering: Node.js, Python, Databases (SQL & NoSQL), REST APIs, GraphQL, Caching, and Microservices.',
        'duration': 220
    },
    'blockchain': {
        'title': 'Blockchain & Web3 Developer Roadmap',
        'category': 'Web Development',
        'difficulty': 'advanced',
        'description': 'Master Web3 engineering: Ethereum, Solidity, Smart Contracts, Hardhat, Ethers.js, IPFS, DeFi protocols, and Zero-Knowledge Proofs.',
        'duration': 240
    },
    'c': {
        'title': 'C Programming & Systems Basics Roadmap',
        'category': 'Programming',
        'difficulty': 'beginner',
        'description': 'Master core C programming: Memory allocation, pointers, structs, file I/O, data structures, compilation with GCC, and debugging with GDB.',
        'duration': 160
    },
    'css': {
        'title': 'Modern CSS & Responsive Design Roadmap',
        'category': 'Web Development',
        'difficulty': 'beginner',
        'description': 'Master modern CSS: Flexbox, Grid, CSS Variables, Animations, TailwindCSS, PostCSS, Accessibility, and Responsive Layouts.',
        'duration': 140
    },
    'cyber-security': {
        'title': 'Cyber Security & Ethical Hacking Roadmap',
        'category': 'Security',
        'difficulty': 'intermediate',
        'description': 'Master security engineering: Network Security, Penetration Testing, OWASP Top 10, Cryptography, Burp Suite, and Incident Response.',
        'duration': 210
    },
    'data-engineer': {
        'title': 'Data Engineer Roadmap',
        'category': 'Data Science',
        'difficulty': 'advanced',
        'description': 'Build enterprise data infrastructure: Apache Spark, Airflow, Kafka, Snowflake, Data Warehousing, ETL Pipelines, and Databricks.',
        'duration': 240
    },
    'devrel': {
        'title': 'Developer Relations (DevRel) Roadmap',
        'category': 'General',
        'difficulty': 'intermediate',
        'description': 'Master DevRel: Developer Advocacy, Technical Content Creation, Community Management, SDKs/APIs DX, and Developer Marketing.',
        'duration': 150
    },
    'devsecops': {
        'title': 'DevSecOps Engineering Roadmap',
        'category': 'DevOps',
        'difficulty': 'advanced',
        'description': 'Integrate security into CI/CD: SAST/DAST scanning, Container Security, IAM, Vault Secrets management, and Compliance as Code.',
        'duration': 210
    },
    'django': {
        'title': 'Django & Python Web Developer Roadmap',
        'category': 'Backend',
        'difficulty': 'intermediate',
        'description': 'Master Python web development with Django: MVT architecture, ORM, Django REST Framework (DRF), Celery workers, and PostgreSQL.',
        'duration': 180
    },
    'docker': {
        'title': 'Docker & Containerization Roadmap',
        'category': 'DevOps',
        'difficulty': 'beginner',
        'description': 'Master containerization: Docker Engine, Images, Multi-stage builds, Docker Compose, Volumes, Networks, and Registry security.',
        'duration': 120
    },
    'elasticsearch': {
        'title': 'Elasticsearch & Search Engineering Roadmap',
        'category': 'System Design',
        'difficulty': 'intermediate',
        'description': 'Master search engines: Lucene inverted indexes, Elasticsearch cluster management, Logstash, Kibana, vector search, and aggregations.',
        'duration': 160
    },
    'forward-deployed-engineer': {
        'title': 'Forward Deployed Engineer Roadmap',
        'category': 'Software Engineering',
        'difficulty': 'advanced',
        'description': 'Deploy solutions for enterprise clients: Custom integrations, client data pipelines, system architecture, technical leadership, and field engineering.',
        'duration': 200
    },
    'frontend': {
        'title': 'Frontend Developer Roadmap',
        'category': 'Web Development',
        'difficulty': 'beginner',
        'description': 'Master modern frontend engineering: HTML, CSS, JavaScript, React, Next.js, state management, web performance, and browser APIs.',
        'duration': 180
    },
    'java': {
        'title': 'Java Developer & Enterprise Systems Roadmap',
        'category': 'Programming',
        'difficulty': 'intermediate',
        'description': 'Master Java & JVM: OOP principles, Collections, Streams API, Multithreading, JVM Garbage Collection, Maven/Gradle, and JUnit testing.',
        'duration': 200
    },
    'javascript': {
        'title': 'JavaScript Deep Dive Roadmap',
        'category': 'Programming',
        'difficulty': 'beginner',
        'description': 'Master core JS & ES6+: Closures, Prototypes, Event Loop, Promises, Async/Await, DOM, Modules, and Modern Tooling.',
        'duration': 160
    },
    'kotlin': {
        'title': 'Kotlin Programming Roadmap',
        'category': 'Programming',
        'difficulty': 'beginner',
        'description': 'Master Kotlin: Null safety, Smart casts, Extension functions, Coroutines, Channels, Higher-order functions, and Multiplatform (KMP).',
        'duration': 150
    },
    'leetcode': {
        'title': 'LeetCode & Competitive Programming Roadmap',
        'category': 'Algorithms',
        'difficulty': 'intermediate',
        'description': 'Master Data Structures & Algorithms patterns: Two Pointers, Sliding Window, Graphs, Trees, Dynamic Programming, and System Interviews.',
        'duration': 220
    },
    'linux': {
        'title': 'Linux System Administration Roadmap',
        'category': 'DevOps',
        'difficulty': 'beginner',
        'description': 'Master Linux OS: CLI navigation, Bash scripting, file permissions, systemd services, process management, networking, and SSH hardening.',
        'duration': 150
    },
    'nodejs': {
        'title': 'Node.js Backend Developer Roadmap',
        'category': 'Backend',
        'difficulty': 'intermediate',
        'description': 'Master Node.js runtime: Event loop, Streams, Buffer, Express/Fastify, REST APIs, WebSockets, Prisma ORM, and Performance profiling.',
        'duration': 190
    },
    'php': {
        'title': 'PHP & Modern Web Development Roadmap',
        'category': 'Backend',
        'difficulty': 'beginner',
        'description': 'Master modern PHP (PHP 8+): OOP, Composer, Laravel framework, MySQL integration, Authentication, REST APIs, and Testing with PHPUnit.',
        'duration': 170
    },
    'postgresql-dba': {
        'title': 'PostgreSQL DBA & Database Engineering Roadmap',
        'category': 'Database',
        'difficulty': 'advanced',
        'description': 'Master PostgreSQL administration: Indexing (B-Tree, GIN), Query Planner, Replication, Connection Pooling (PgBouncer), Backup & WAL logs.',
        'duration': 200
    },
    'product-manager': {
        'title': 'Technical Product Manager Roadmap',
        'category': 'General',
        'difficulty': 'intermediate',
        'description': 'Master Tech PM skills: Product Strategy, Agile/Scrum, User Analytics, System Architecture for PMs, Wireframing, and Roadmapping.',
        'duration': 160
    },
    'prompt-engineering': {
        'title': 'Prompt Engineering & LLM Optimization Roadmap',
        'category': 'Data Science',
        'difficulty': 'beginner',
        'description': 'Master prompt craft: Zero-shot, Few-shot, Chain-of-Thought (CoT), Tree of Thoughts, System Prompts, Hallucination reduction, and RAG prompts.',
        'duration': 120
    },
    'python-data-analysis': {
        'title': 'Python Data Analysis & Science Roadmap',
        'category': 'Data Science',
        'difficulty': 'beginner',
        'description': 'Master data analysis: NumPy, Pandas, Matplotlib, Seaborn, Exploratory Data Analysis (EDA), Jupyter, and Statistical Modeling.',
        'duration': 170
    },
    'qa': {
        'title': 'QA & Software Testing Automation Roadmap',
        'category': 'Software Engineering',
        'difficulty': 'intermediate',
        'description': 'Master QA automation: Unit testing, Integration testing, Cypress, Playwright, Selenium, Jest, API Testing with Postman, and CI/CD pipelines.',
        'duration': 180
    },
    'react-native': {
        'title': 'React Native Mobile Developer Roadmap',
        'category': 'Mobile Development',
        'difficulty': 'intermediate',
        'description': 'Build cross-platform iOS & Android apps: React Native CLI, Expo, Navigation v6, Reanimated 3, Redux Toolkit, and Native Modules.',
        'duration': 190
    },
    'redis': {
        'title': 'Redis In-Memory Database Roadmap',
        'category': 'Database',
        'difficulty': 'intermediate',
        'description': 'Master Redis caching & data stores: Data structures (Hashes, Sets, Sorted Sets), Cache Eviction Policies, Pub/Sub, Sentinel, and Redis Cluster.',
        'duration': 130
    },
    'ruby-on-rails': {
        'title': 'Ruby on Rails Developer Roadmap',
        'category': 'Backend',
        'difficulty': 'intermediate',
        'description': 'Master Rails web development: Active Record ORM, ActionPack, ActionCable WebSockets, Sidekiq background jobs, RSpec testing, and Deployment.',
        'duration': 180
    },
    'rust': {
        'title': 'Rust Systems Programming Roadmap',
        'category': 'Programming',
        'difficulty': 'advanced',
        'description': 'Master Rust: Ownership, Borrowing, Lifetimes, Pattern Matching, Traits, Concurrency without Data Races, Cargo, and WebAssembly (Wasm).',
        'duration': 230
    },
    'server-side-game-developer': {
        'title': 'Server-Side Game Developer Roadmap',
        'category': 'Backend',
        'difficulty': 'advanced',
        'description': 'Build multiplayer game backends: UDP/TCP networking, WebSockets, Matchmaking services, Leaderboards, State synchronization, and Spatial partitioning.',
        'duration': 220
    },
    'shell-bash': {
        'title': 'Shell / Bash Scripting Roadmap',
        'category': 'DevOps',
        'difficulty': 'beginner',
        'description': 'Master terminal automation: Bash syntax, Control flow, Functions, Regex, Grep/Awk/Sed text processing, System monitoring, and Automation scripts.',
        'duration': 110
    },
    'software-architect': {
        'title': 'Software Architect & System Design Roadmap',
        'category': 'System Design',
        'difficulty': 'advanced',
        'description': 'Master large-scale distributed systems: Microservices, High Availability, Load Balancing, Sharding, Caching, Event-Driven, and Fault Tolerance.',
        'duration': 220
    },
    'spring-boot': {
        'title': 'Spring Boot & Java Enterprise Roadmap',
        'category': 'Backend',
        'difficulty': 'intermediate',
        'description': 'Master Enterprise Java: Spring Core, Spring Boot, Spring Data JPA, Spring Security, Microservices Architecture, Kafka, and Docker.',
        'duration': 210
    },
    'sql': {
        'title': 'SQL & Relational Database Design Roadmap',
        'category': 'Database',
        'difficulty': 'beginner',
        'description': 'Master database queries & design: DDL/DML, JOINs, Subqueries, Window Functions, Indexing, Transactions, and Schema Normalization.',
        'duration': 140
    },
    'technical-writer': {
        'title': 'Technical Writer Roadmap',
        'category': 'General',
        'difficulty': 'beginner',
        'description': 'Master technical documentation: API Documentation (OpenAPI/Swagger), Markdown, Docs-as-Code, GitBook, Readme design, and UX writing.',
        'duration': 120
    },
    'terraform': {
        'title': 'Terraform & Infrastructure as Code Roadmap',
        'category': 'DevOps',
        'difficulty': 'intermediate',
        'description': 'Master IaC: HCL syntax, Providers (AWS/GCP/Azure), State management, Modules, Terraform Cloud, Terragrunt, and CI/CD automation.',
        'duration': 160
    },
    'vibe-coding': {
        'title': 'Vibe Coding & AI-Assisted Development Roadmap',
        'category': 'Web Development',
        'difficulty': 'beginner',
        'description': 'Master modern AI coding workflows: Cursor IDE, Antigravity, GitHub Copilot, Claude Code, rapid prototyping, and AI pair programming.',
        'duration': 100
    },
    'vue': {
        'title': 'Vue.js Frontend Developer Roadmap',
        'category': 'Web Development',
        'difficulty': 'beginner',
        'description': 'Master Vue 3: Composition API, Single File Components (.vue), Pinia state management, Vue Router, Nuxt.js SSR, and Vite.',
        'duration': 160
    }
}

BOILERPLATE = [
    'Find the detailed version of this roadmap',
    'along with other similar roadmaps',
    'roadmap.sh',
    'Visit the following relevant tracks',
    'Related Roadmaps',
    'Special thanks to',
    'helping us create this roadmap',
    'Scrimba is offering',
    'on their',
    'Check them out!',
    'Definition & Scope'
]

def clean_lines(text):
    raw_lines = text.split('\n')
    cleaned = []
    for line in raw_lines:
        line_str = line.strip()
        if not line_str:
            continue
        if any(b in line_str for b in BOILERPLATE):
            continue
        cleaned.append(line_str)
    return cleaned

def generate_modules_for_key(key, lines):
    # Create 5-7 logical modules from parsed text lines
    meta = META.get(key, {})
    title = meta.get('title', key.capitalize())
    category = meta.get('category', 'General')
    
    # Filter lines into distinct topic strings (ignore short noise)
    unique_topics = []
    seen = set()
    for l in lines:
        if len(l) < 3 or len(l) > 60:
            continue
        if l in seen:
            continue
        seen.add(l)
        unique_topics.append(l)
    
    if len(unique_topics) < 8:
        # Default topic generator if PDF is graphical
        unique_topics = [
            f'{title} Fundamentals & Environment Setup',
            'Core Language Syntax & Primitive Types',
            'Data Structures & Collection Types',
            'Control Flow, Functions & Modular Code',
            'Advanced Architecture & Design Patterns',
            'Testing, Debugging & Performance Optimization',
            'Production Deployment & Ecosystem Integration'
        ]

    # Chunk topics into 5-6 modules
    chunk_size = max(2, len(unique_topics) // 6)
    modules = []
    mod_id_prefix = key.replace('-', '')[:4]
    
    for mod_idx in range(6):
        start = mod_idx * chunk_size
        end = start + chunk_size if mod_idx < 5 else len(unique_topics)
        mod_topics = unique_topics[start:end]
        if not mod_topics:
            mod_topics = [f'{title} Module {mod_idx+1} Concept']

        mod_title = mod_topics[0] if mod_topics else f'{title} Section {mod_idx+1}'
        mod_desc = f'Master key topics in {mod_title}: {", ".join(mod_topics[:3])}.'
        
        lessons = [
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 1}',
                'title': f'Overview & Theory: {mod_topics[0] if mod_topics else mod_title}',
                'type': 'article',
                'duration': 25
            },
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 2}',
                'title': f'Deep Dive & Video Guide: {mod_topics[1] if len(mod_topics) > 1 else mod_title}',
                'type': 'video',
                'duration': 35
            },
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 3}',
                'title': f'Hands-on Sandbox Challenge: {mod_topics[-1]}',
                'type': 'code',
                'duration': 40
            }
        ]

        modules.append({
            '_id': f'{mod_id_prefix}-mod-{mod_idx+1}',
            'order': mod_idx + 1,
            'title': mod_title,
            'description': mod_desc,
            'topics': mod_topics[:5],
            'lessons': lessons
        })
    
    return modules

def main():
    files = sorted(glob.glob(os.path.join(ROADMAPS_DIR, '*.pdf')))
    print(f'Found {len(files)} PDF files in {ROADMAPS_DIR}')
    
    roadmaps_data = []

    for pdf_path in files:
        filename = os.path.basename(pdf_path)
        if filename == 'c (1).pdf':  # skip duplicate
            continue
        
        key = filename.replace('.pdf', '')
        if key not in META:
            print(f'Skipping unknown key: {key}')
            continue

        try:
            reader = pypdf.PdfReader(pdf_path)
            full_text = ''
            for page in reader.pages:
                full_text += page.extract_text() or ''
            lines = clean_lines(full_text)
        except Exception as e:
            print(f'Error reading {filename}: {e}')
            lines = []

        meta = META[key]
        modules = generate_modules_for_key(key, lines)

        roadmap_obj = {
            'id': key,
            'title': meta['title'],
            'category': meta['category'],
            'difficulty': meta['difficulty'],
            'description': meta['description'],
            'duration': meta['duration'],
            'modules': modules
        }

        roadmaps_data.append(roadmap_obj)
        print(f'✓ Processed {key} ({meta["title"]}) - {len(modules)} modules')

    print(f'\nTotal Roadmaps Processed: {len(roadmaps_data)}')

    # 1. Write JavaScript Export
    js_content = "/**\n * Native Roadmaps Data for CodeSphere\n * Auto-generated from official roadmaps for all 43 tech tracks.\n */\n\n"
    js_content += "export const NATIVE_ROADMAPS = " + json.dumps(roadmaps_data, indent=2) + ";\n\n"
    js_content += "export default NATIVE_ROADMAPS;\n"

    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f'Saved JavaScript dataset to {OUTPUT_JS}')

    # 2. Write JSON for backend seeding
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(roadmaps_data, f, indent=2)
    print(f'Saved JSON dataset to {OUTPUT_JSON}')

if __name__ == '__main__':
    main()
