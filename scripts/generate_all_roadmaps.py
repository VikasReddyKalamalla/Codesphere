import pypdf
import glob
import os
import json
import re

DIR_1 = '/Users/venkatkarthik/Desktop/Codesphere/roadamaps'
DIR_2 = '/Users/venkatkarthik/Desktop/Codesphere/Roadmaps'

OUTPUT_JS = '/Users/venkatkarthik/Desktop/Codesphere/client/src/features/learning/data/nativeRoadmapsData.js'
OUTPUT_JSON = '/Users/venkatkarthik/Desktop/Codesphere/server/data/roadmapsData.json'

CATEGORIES = {
    'Web Development': ['frontend', 'css', 'html', 'javascript', 'typescript', 'react', 'vue', 'angular', 'nextjs', 'blockchain', 'vibe-coding', 'design-system', 'ux-design', 'wordpress'],
    'Backend': ['backend', 'nodejs', 'python', 'django', 'php', 'laravel', 'ruby-on-rails', 'ruby', 'aspnet-core', 'java', 'spring-boot', 'golang', 'c', 'cpp', 'server-side-game-developer', 'api-design', 'openclaw'],
    'Data Science': ['ai-engineer', 'ai-agents', 'ai-product-builder', 'ai-data-scientist', 'machine-learning', 'python-data-analysis', 'prompt-engineering', 'data-engineer', 'data-analyst', 'bi-analyst', 'mlops'],
    'DevOps & Cloud': ['devops', 'docker', 'kubernetes', 'terraform', 'aws', 'cloudflare', 'linux', 'shell-bash', 'devsecops'],
    'Security': ['cyber-security', 'ai-red-teaming', 'network-engineer'],
    'Mobile Development': ['android', 'ios', 'swift-ui', 'react-native', 'flutter'],
    'Database': ['sql', 'postgresql-dba', 'redis', 'mongodb', 'elasticsearch'],
    'System Design': ['software-architect', 'system-design', 'software-design-architecture'],
    'Software Engineering': ['leetcode', 'datastructures-and-algorithms', 'computer-science', 'git-github', 'qa', 'game-developer'],
    'Management & Career': ['product-manager', 'technical-writer', 'devrel', 'engineering-manager', 'forward-deployed-engineer']
}

DIFFICULTIES = {
    'beginner': ['frontend', 'html', 'css', 'javascript', 'python', 'c', 'kotlin', 'php', 'sql', 'docker', 'linux', 'shell-bash', 'prompt-engineering', 'python-data-analysis', 'technical-writer', 'vibe-coding', 'vue', 'react', 'git-github', 'computer-science', 'ux-design', 'wordpress', 'ruby'],
    'intermediate': ['backend', 'react-native', 'nodejs', 'django', 'spring-boot', 'terraform', 'qa', 'devrel', 'product-manager', 'redis', 'ruby-on-rails', 'android', 'cyber-security', 'elasticsearch', 'leetcode', 'cpp', 'golang', 'java', 'swift-ui', 'ios', 'flutter', 'nextjs', 'angular', 'aspnet-core', 'laravel', 'data-analyst', 'bi-analyst', 'api-design', 'cloudflare', 'datastructures-and-algorithms', 'design-system', 'mongodb', 'network-engineer'],
    'advanced': ['ai-engineer', 'ai-agents', 'ai-red-teaming', 'blockchain', 'data-engineer', 'devsecops', 'postgresql-dba', 'rust', 'server-side-game-developer', 'software-architect', 'ai-product-builder', 'forward-deployed-engineer', 'ai-data-scientist', 'aws', 'kubernetes', 'machine-learning', 'mlops', 'openclaw', 'scala', 'software-design-architecture', 'system-design', 'game-developer', 'engineering-manager']
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
    'Definition & Scope',
    'Have a look at the following',
    'Continue Learning with following',
    'Visit Backend path and see',
    'Find the interactive version',
    'roadmap.sh/pdf'
]

def clean_lines(text):
    raw = text.split('\n')
    cleaned = []
    for l in raw:
        s = l.strip()
        if not s:
            continue
        if any(b.lower() in s.lower() for b in BOILERPLATE):
            continue
        cleaned.append(s)
    return cleaned

def get_category_and_diff(key):
    cat = 'General'
    for c_name, keys in CATEGORIES.items():
        if key in keys:
            cat = c_name
            break
    
    diff = 'intermediate'
    for d_name, keys in DIFFICULTIES.items():
        if key in keys:
            diff = d_name
            break
            
    return cat, diff

def format_title(key):
    special = {
        'ai-agents': 'AI Agents & Multi-Agent Architecture',
        'ai-engineer': 'AI & LLM Engineer Roadmap',
        'ai-data-scientist': 'AI & Data Scientist Roadmap',
        'ai-product-builder': 'AI Product Builder Roadmap',
        'ai-red-teaming': 'AI Red Teaming & Security Roadmap',
        'api-design': 'API Design & Architecture Roadmap',
        'aspnet-core': 'ASP.NET Core Developer Roadmap',
        'aws': 'AWS Cloud Architect Roadmap',
        'bi-analyst': 'Business Intelligence (BI) Analyst',
        'c': 'C Programming & Systems Basics',
        'cpp': 'C++ Systems & Software Engineering',
        'claude-code': 'Claude Code & AI Development Workflow',
        'cyber-security': 'Cyber Security & Ethical Hacking',
        'datastructures-and-algorithms': 'Data Structures & Algorithms Masterclass',
        'devrel': 'Developer Relations (DevRel) Roadmap',
        'devsecops': 'DevSecOps & CI/CD Security',
        'django': 'Django & Python Web Development',
        'forward-deployed-engineer': 'Forward Deployed Engineer Roadmap',
        'git-github': 'Git & GitHub Version Control Mastery',
        'golang': 'Go (Golang) Backend & Systems Roadmap',
        'html': 'HTML5 & Semantic Web Architecture',
        'ios': 'iOS & Swift Mobile Development',
        'machine-learning': 'Machine Learning Engineering Roadmap',
        'mlops': 'MLOps & Machine Learning Infrastructure',
        'nextjs': 'Next.js & Full-Stack React Architecture',
        'nodejs': 'Node.js Backend Developer Roadmap',
        'openclaw': 'OpenClaw & Agent Automation Systems',
        'postgresql-dba': 'PostgreSQL DBA & Database Engineering',
        'prompt-engineering': 'Prompt Engineering & LLM Optimization',
        'python-data-analysis': 'Python Data Analysis & Science',
        'qa': 'QA & Software Testing Automation',
        'react-native': 'React Native Cross-Platform Mobile',
        'ruby-on-rails': 'Ruby on Rails Web Development',
        'server-side-game-developer': 'Server-Side Game Developer Roadmap',
        'shell-bash': 'Shell & Bash Automation Scripting',
        'software-architect': 'Software Architect & System Design',
        'software-design-architecture': 'Software Design & Clean Architecture',
        'spring-boot': 'Spring Boot & Enterprise Java',
        'swift-ui': 'SwiftUI & Modern iOS Development',
        'technical-writer': 'Technical Writing & API Documentation',
        'ux-design': 'UX/UI Product Design Roadmap',
        'vibe-coding': 'Vibe Coding & AI-Assisted Prototyping',
        'vue': 'Vue.js Modern Frontend Development'
    }
    if key in special:
        return special[key]
    
    words = key.split('-')
    capitalized = [w.capitalize() if w not in ['and', 'or', 'to', 'for', 'a', 'an', 'in', 'on', 'of'] else w for w in words]
    return ' '.join(capitalized) + ' Roadmap'

def generate_curriculum(key, lines):
    title = format_title(key)
    cat, diff = get_category_and_diff(key)
    
    # Filter lines into unique meaningful topics
    unique_topics = []
    seen = set()
    for l in lines:
        if len(l) < 3 or len(l) > 65:
            continue
        if l in seen:
            continue
        seen.add(l)
        unique_topics.append(l)
        
    if len(unique_topics) < 6:
        unique_topics = [
            f'{title} Core Foundations & Environment Setup',
            'Core Syntax & Essential Fundamentals',
            'Data Processing & Architecture Patterns',
            'State Management & Modular Integration',
            'Testing, Debugging & Performance Tuning',
            'Production Deployment & Enterprise Best Practices'
        ]

    # Partition topics into 5-6 structured modules
    chunk_size = max(2, len(unique_topics) // 6)
    modules = []
    mod_id_prefix = key.replace('-', '')[:4]
    
    for mod_idx in range(6):
        start = mod_idx * chunk_size
        end = start + chunk_size if mod_idx < 5 else len(unique_topics)
        mod_topics = unique_topics[start:end]
        if not mod_topics:
            mod_topics = [f'{title} Skill Module {mod_idx+1}']

        mod_title = mod_topics[0]
        mod_desc = f'Master official topics in {mod_title}: {", ".join(mod_topics[1:4]) if len(mod_topics)>1 else mod_title}.'
        
        lessons = [
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 1}',
                'title': f'Overview & Theory: {mod_topics[0]}',
                'type': 'article',
                'duration': 20
            },
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 2}',
                'title': f'Video Guide: {mod_topics[1] if len(mod_topics) > 1 else mod_title}',
                'type': 'video',
                'duration': 30
            },
            {
                '_id': f'{mod_id_prefix}-l-{mod_idx*3 + 3}',
                'title': f'Interactive Challenge: {mod_topics[-1]}',
                'type': 'code',
                'duration': 35
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
        
    return {
        'id': key,
        'title': title,
        'category': cat,
        'difficulty': diff,
        'description': f'Complete structured learning path for {title}. Covers official roadmap concepts step-by-step with interactive lessons and sandbox exercises.',
        'duration': 160 + (len(modules) * 15),
        'modules': modules
    }

def main():
    files_1 = glob.glob(os.path.join(DIR_1, '*.pdf'))
    files_2 = glob.glob(os.path.join(DIR_2, '*.pdf'))
    
    pdf_map = {}
    for p in files_1 + files_2:
        base = os.path.basename(p)
        if base == 'c (1).pdf': continue
        k = base.replace('.pdf', '')
        if k not in pdf_map:
            pdf_map[k] = p

    sorted_keys = sorted(pdf_map.keys())
    print(f'Found {len(sorted_keys)} unique PDF roadmaps across both folders.')

    roadmaps = []

    for k in sorted_keys:
        pdf_path = pdf_map[k]
        try:
            reader = pypdf.PdfReader(pdf_path)
            full_text = ''
            for page in reader.pages:
                full_text += page.extract_text() or ''
            lines = clean_lines(full_text)
        except Exception as e:
            print(f'Error reading {pdf_path}: {e}')
            lines = []
            
        curriculum = generate_curriculum(k, lines)
        roadmaps.append(curriculum)
        print(f'✓ Processed {k:30s} -> {curriculum["title"]} ({curriculum["category"]})')

    print(f'\nTotal Roadmaps Generated: {len(roadmaps)}')

    # 1. Output JS file
    js_content = "/**\n * Native Roadmaps Data for CodeSphere\n * Auto-generated from official roadmaps for all 83 tech tracks.\n */\n\n"
    js_content += "export const NATIVE_ROADMAPS = " + json.dumps(roadmaps, indent=2) + ";\n\n"
    js_content += "export default NATIVE_ROADMAPS;\n"

    with open(OUTPUT_JS, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f'Saved JS dataset to {OUTPUT_JS}')

    # 2. Output JSON file
    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, 'w', encoding='utf-8') as f:
        json.dump(roadmaps, f, indent=2)
    print(f'Saved JSON dataset to {OUTPUT_JSON}')

if __name__ == '__main__':
    main()
