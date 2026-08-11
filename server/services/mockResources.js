const fs = require('fs');
const path = require('path');

const SEEDED_NOTES = [
  {
    "_id": "6a7acba7d5451ff75dbc3cb6",
    "title": "CSS3 Complete Master Notes & Cheat Sheet",
    "description": "Master Cascading Style Sheets (CSS3) from basic selectors, box model, and Flexbox/Grid layouts to keyframe animations and responsive design.",
    "category": "Full Stack & Web Dev",
    "difficulty": "beginner",
    "tags": [
      "css",
      "css3",
      "frontend",
      "web-dev",
      "cheatsheet",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "/mock-resources-proxy/CSS_Complete_Notes.pdf",
    "externalUrl": "/mock-resources-proxy/CSS_Complete_Notes.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 294,
    "downloadsCount": 154,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:43.199Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7acba7d5451ff75dbc3cb7",
    "title": "DSA Complete Notes & Algorithms Handbook",
    "description": "Comprehensive Data Structures & Algorithms handbook covering Arrays, Linked Lists, Stacks, Queues, Trees, Graphs, Sorting, DP, and LeetCode patterns.",
    "category": "DSA & Algorithms",
    "difficulty": "intermediate",
    "tags": [
      "dsa",
      "algorithms",
      "data-structures",
      "leetcode",
      "cpp",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "/mock-resources-proxy/DSA_CompleteNotes.pdf",
    "externalUrl": "/mock-resources-proxy/DSA_CompleteNotes.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 270,
    "downloadsCount": 117,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:43.380Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7acba9d5451ff75dbc3cb8",
    "title": "Flask Web Framework Complete Cheatsheet",
    "description": "Quick reference for Python Flask micro-framework: routing, request handling, Jinja2 templating, ORM database integration, and REST APIs.",
    "category": "AI, ML & Data Science",
    "difficulty": "beginner",
    "tags": [
      "python",
      "flask",
      "backend",
      "cheatsheet",
      "api",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786432425/codesphere/notes/laoiprmkod4jtjmbfvmb.pdf",
    "externalUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786432425/codesphere/notes/laoiprmkod4jtjmbfvmb.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 360,
    "downloadsCount": 247,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:45.681Z",
    "status": "published",
    "isCloudinary": true
  },
  {
    "_id": "6a7acbaad5451ff75dbc3cb9",
    "title": "HTML5 Complete Handbook & Reference",
    "description": "Essential HTML5 fundamentals, semantic elements, form controls, web accessibility (a11y), canvas, media tags, and document structure.",
    "category": "Full Stack & Web Dev",
    "difficulty": "beginner",
    "tags": [
      "html",
      "html5",
      "web-dev",
      "frontend",
      "cheatsheet",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "/mock-resources-proxy/HTML_Complete_Notes.pdf",
    "externalUrl": "/mock-resources-proxy/HTML_Complete_Notes.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 477,
    "downloadsCount": 206,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:45.862Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7acbaad5451ff75dbc3cba",
    "title": "Java Complete Mastery Notes & Handbook",
    "description": "Complete Core Java reference covering Object-Oriented Programming (OOP), Multithreading, Collections Framework, JVM internals, and Exception Handling.",
    "category": "General CS",
    "difficulty": "intermediate",
    "tags": [
      "java",
      "core-java",
      "oop",
      "backend",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "/mock-resources-proxy/Java_Complete_Notes.pdf",
    "externalUrl": "/mock-resources-proxy/Java_Complete_Notes.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 319,
    "downloadsCount": 208,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:46.157Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7acbaad5451ff75dbc3cbb",
    "title": "JavaScript Chapterwise Complete Notes",
    "description": "In-depth JavaScript guide covering variables, DOM manipulation, ES6+ features, closures, prototypes, event loop, Promises, and async/await.",
    "category": "Full Stack & Web Dev",
    "difficulty": "intermediate",
    "tags": [
      "javascript",
      "js",
      "es6",
      "frontend",
      "web-dev",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "/mock-resources-proxy/JS_Chapterwise_Notes.pdf",
    "externalUrl": "/mock-resources-proxy/JS_Chapterwise_Notes.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 498,
    "downloadsCount": 102,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:46.363Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7acbacd5451ff75dbc3cbc",
    "title": "PHP Backend Scripting Complete Cheatsheet",
    "description": "Essential PHP reference covering language syntax, array functions, superglobals, MySQLi/PDO database connections, and session management.",
    "category": "Full Stack & Web Dev",
    "difficulty": "beginner",
    "tags": [
      "php",
      "backend",
      "web-dev",
      "mysql",
      "cheatsheet",
      "notes"
    ],
    "resourceType": "pdf",
    "fileUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786432427/codesphere/notes/wqgzfxjme1drye6f3me7.pdf",
    "externalUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786432427/codesphere/notes/wqgzfxjme1drye6f3me7.pdf",
    "uploadedBy": {
      "fullName": "CodeSphere Team",
      "avatar": ""
    },
    "views": 410,
    "downloadsCount": 194,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:13:48.931Z",
    "status": "published",
    "isCloudinary": true
  }
];

let mockResources = [];
let isMockSeeded = false;

const seedMockResources = () => {
  if (isMockSeeded) return mockResources;
  mockResources = SEEDED_NOTES;
  isMockSeeded = true;
  return mockResources;
};

module.exports = { seedMockResources };
