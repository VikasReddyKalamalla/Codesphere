require('dotenv').config();
const mongoose = require('mongoose');
const LearningPath = require('./models/LearningPath');
const Module = require('./models/Module');
const Lesson = require('./models/Lesson');

// Rich article content generator per course + module
const getArticleContent = (courseTitle, moduleTitle, lessonTitle) => {
  const course = courseTitle.toLowerCase();
  const mod = moduleTitle.toLowerCase();

  if (course.includes('full stack') || course.includes('node.js backend')) {
    return `# ${lessonTitle}\n\n## Overview\nThis lesson covers essential concepts in ${moduleTitle} for ${courseTitle}.\n\n## What You Will Learn\n- Core fundamentals and syntax\n- Real-world application patterns\n- Best practices and common pitfalls\n- Hands-on coding exercises\n\n## Key Concepts\n\n### 1. Setting Up Your Environment\nBefore writing any code, ensure you have Node.js (v18+) installed. Use \`nvm\` to manage Node versions:\n\`\`\`bash\nnvm install 18\nnvm use 18\nnode --version\n\`\`\`\n\n### 2. Core Implementation\n\`\`\`javascript\nconst express = require('express');\nconst app = express();\n\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'OK', timestamp: new Date() });\n});\n\napp.listen(5000, () => console.log('Server running on port 5000'));\n\`\`\`\n\n### 3. Understanding the Request-Response Cycle\nEvery HTTP request goes through middleware in order:\n1. **Request arrives** at your Express server\n2. **Middleware processes** it (auth, validation, logging)\n3. **Route handler** executes business logic\n4. **Response** is sent back to the client\n\n### 4. Error Handling\nAlways wrap async operations in try/catch:\n\`\`\`javascript\nconst asyncHandler = (fn) => (req, res, next) =>\n  Promise.resolve(fn(req, res, next)).catch(next);\n\`\`\`\n\n## Summary\nIn this lesson you learned how to ${lessonTitle.toLowerCase()}. Practice the exercises in the sandbox before moving to the next lesson.\n\n## Additional Resources\n- [MDN Web Docs](https://developer.mozilla.org)\n- [Node.js Official Docs](https://nodejs.org/docs)\n- [Express.js Guide](https://expressjs.com/guide)`;
  }

  if (course.includes('react') || course.includes('typescript')) {
    return `# ${lessonTitle}\n\n## Overview\n${lessonTitle} is a fundamental concept in ${moduleTitle}. This lesson provides both theory and practical coding examples.\n\n## Prerequisites\n- Basic JavaScript knowledge\n- Familiarity with HTML/CSS\n- Node.js installed\n\n## Core Concepts\n\n### 1. Component Architecture\nReact applications are built with components — reusable, self-contained UI pieces:\n\`\`\`tsx\ninterface UserCardProps {\n  name: string;\n  role: string;\n  avatar?: string;\n}\n\nconst UserCard: React.FC<UserCardProps> = ({ name, role, avatar }) => {\n  return (\n    <div className=\"card\">\n      {avatar && <img src={avatar} alt={name} />}\n      <h3>{name}</h3>\n      <p>{role}</p>\n    </div>\n  );\n};\n\nexport default UserCard;\n\`\`\`\n\n### 2. State Management with useState\n\`\`\`tsx\nimport { useState } from 'react';\n\nconst Counter = () => {\n  const [count, setCount] = useState<number>(0);\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount(c => c + 1)}>Increment</button>\n    </div>\n  );\n};\n\`\`\`\n\n### 3. TypeScript Benefits\n- **Type safety** catches bugs at compile time\n- **Intellisense** in VS Code with autocompletion\n- **Self-documenting** code through type definitions\n\n## Hands-on Exercise\nCreate a \`TaskList\` component that renders a list of tasks with TypeScript interfaces. Add add/remove functionality with proper typing.\n\n## Summary\nYou now understand ${lessonTitle}. The key takeaway is that TypeScript adds a layer of safety to React development without sacrificing productivity.\n\n## Next Steps\nProceed to the next lesson where we dive deeper into ${moduleTitle}.`;
  }

  if (course.includes('python') || course.includes('data science') || course.includes('machine learning')) {
    return `# ${lessonTitle}\n\n## Overview\nPython is the #1 language for data science and machine learning. In this lesson we cover ${lessonTitle} as part of ${moduleTitle}.\n\n## Setting Up\n\`\`\`bash\npip install pandas numpy matplotlib scikit-learn\n\`\`\`\n\n## Core Concepts\n\n### 1. Data Structures\n\`\`\`python\nimport pandas as pd\nimport numpy as np\n\n# Create a DataFrame\ndf = pd.DataFrame({\n    'name':  ['Alice', 'Bob', 'Charlie'],\n    'score': [92, 85, 78],\n    'grade': ['A', 'B', 'C']\n})\n\nprint(df.describe())\nprint(df.dtypes)\n\`\`\`\n\n### 2. Data Manipulation\n\`\`\`python\n# Filter rows\nhigh_scorers = df[df['score'] > 80]\n\n# GroupBy aggregation\ngrouped = df.groupby('grade')['score'].mean()\n\n# Apply function\ndf['normalized'] = df['score'].apply(lambda x: (x - df['score'].min()) / (df['score'].max() - df['score'].min()))\n\`\`\`\n\n### 3. Visualization\n\`\`\`python\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(10, 6))\nplt.bar(df['name'], df['score'], color=['#2563eb', '#16a34a', '#dc2626'])\nplt.title('Student Scores')\nplt.xlabel('Student')\nplt.ylabel('Score')\nplt.tight_layout()\nplt.savefig('scores.png')\nplt.show()\n\`\`\`\n\n## Practice Exercise\nLoad a CSV file, clean the data (handle missing values, fix data types), and produce a summary visualization.\n\n## Summary\n${lessonTitle} is essential for any Python data workflow. Practice using real datasets from [Kaggle](https://kaggle.com).`;
  }

  if (course.includes('devops') || course.includes('cloud') || course.includes('aws')) {
    return `# ${lessonTitle}\n\n## Overview\nThis lesson covers ${lessonTitle} — a critical topic in modern ${course.includes('aws') ? 'cloud infrastructure' : 'DevOps engineering'}.\n\n## Key Concepts\n\n### 1. Core Infrastructure\n\`\`\`yaml\n# docker-compose.yml\nversion: '3.8'\nservices:\n  app:\n    build: .\n    ports:\n      - '3000:3000'\n    environment:\n      - NODE_ENV=production\n      - DB_URL=mongodb://mongo:27017/mydb\n    depends_on:\n      - mongo\n  mongo:\n    image: mongo:6\n    volumes:\n      - mongo_data:/data/db\nvolumes:\n  mongo_data:\n\`\`\`\n\n### 2. CI/CD Pipeline\n\`\`\`yaml\n# .github/workflows/deploy.yml\nname: Deploy to Production\non:\n  push:\n    branches: [main]\njobs:\n  deploy:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - name: Build Docker image\n        run: docker build -t myapp:latest .\n      - name: Push to registry\n        run: docker push myregistry/myapp:latest\n      - name: Deploy to server\n        run: ssh deploy@server 'docker pull && docker-compose up -d'\n\`\`\`\n\n### 3. Infrastructure as Code\n\`\`\`hcl\n# main.tf\nresource \"aws_instance\" \"web\" {\n  ami           = \"ami-0c55b159cbfafe1f0\"\n  instance_type = \"t3.micro\"\n\n  tags = {\n    Name = \"WebServer\"\n    Env  = \"Production\"\n  }\n}\n\`\`\`\n\n## Summary\n${lessonTitle} forms the foundation of automated, reliable deployments. Master these concepts to build production-grade infrastructure.`;
  }

  // Generic rich content for all other courses
  return `# ${lessonTitle}\n\n## Overview\nWelcome to **${lessonTitle}** — part of **${moduleTitle}** in the **${courseTitle}** course.\n\n## Learning Objectives\nBy the end of this lesson you will be able to:\n- Understand the core principles of ${lessonTitle}\n- Apply these concepts in real-world scenarios\n- Identify common mistakes and how to avoid them\n- Complete the hands-on exercise with confidence\n\n## Introduction\nThis topic is fundamental to mastering ${courseTitle}. Whether you are a beginner or have some experience, this lesson is structured to build your understanding from the ground up.\n\n## Core Theory\n\n### What is it?\n${lessonTitle} refers to the set of principles, patterns and techniques used in ${moduleTitle}. Understanding this deeply will accelerate your progress through the rest of the course.\n\n### Why does it matter?\n- It underpins everything you will build in this course\n- Industry professionals use these patterns daily\n- It significantly improves code quality and maintainability\n\n## Practical Example\n\`\`\`\n// Example implementation for ${lessonTitle}\n// Follow along in the sandbox editor\n\nfunction demonstrate() {\n  // Step 1: Setup\n  const config = { module: '${moduleTitle}', lesson: '${lessonTitle}' };\n  \n  // Step 2: Core logic\n  const result = processConfig(config);\n  \n  // Step 3: Output\n  console.log('Result:', result);\n  return result;\n}\n\ndemonstrate();\n\`\`\`\n\n## Common Mistakes\n1. **Skipping the fundamentals** — Always master the basics before moving on\n2. **Not practising** — Reading without coding is ineffective\n3. **Ignoring errors** — Every error message is a learning opportunity\n\n## Exercise\nOpen the sandbox editor and complete the coding challenge for this lesson. Mark it complete once you have finished.\n\n## Summary\nIn this lesson you covered:\n- The theory behind ${lessonTitle}\n- A practical code example\n- Common mistakes to avoid\n\nContinue to the next lesson to build on these foundations.`;
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Updating lessons...\n');

  const paths = await LearningPath.find({}).populate({ path: 'modules' });

  let updated = 0;

  for (const path of paths) {
    const modules = await Module.find({ learningPathId: path._id }).sort({ order: 1 });

    for (const mod of modules) {
      const lessons = await Lesson.find({ moduleId: mod._id }).sort({ order: 1 });

      // Define lesson curriculum per module position
      const modIdx = mod.order; // 1-based
      const lessonDefs = getLessonDefs(path.title, mod.title, modIdx);

      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        const def = lessonDefs[i] || { title: `Lesson ${i+1}: Advanced Topic`, type: 'article', duration: 20 };

        const articleContent = (def.type === 'article' || def.type === 'video')
          ? getArticleContent(path.title, mod.title, def.title)
          : '';

        await Lesson.findByIdAndUpdate(lesson._id, {
          title:    def.title,
          type:     def.type,
          duration: def.duration,
          isFree:   i === 0, // first lesson always free preview
          article:  def.type === 'article' ? articleContent : '',
          videoUrl: def.type === 'video' ? 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' : '',
          code:     def.type === 'code' ? `// ${def.title}\n// Complete the exercise below\n\nconsole.log("Start coding here");` : '',
        });
        updated++;
      }
    }
    process.stdout.write('✓ ' + path.title + '\n');
  }

  console.log('\nUpdated', updated, 'lessons.');
  mongoose.disconnect();
}
