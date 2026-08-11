const fs = require('fs');
const path = require('path');

const SEEDED_NOTES = [
  {
    "_id": "6a7ace3ed5451ff75dbc3d44",
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
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 438,
    "downloadsCount": 179,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:19.272Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7ace3ed5451ff75dbc3d45",
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
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 407,
    "downloadsCount": 229,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:19.486Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7ace40d5451ff75dbc3d47",
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
    "fileUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786433181/codesphere/notes/bonsgozbizambejn2uua.pdf",
    "externalUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786433181/codesphere/notes/bonsgozbizambejn2uua.pdf",
    "uploadedBy": {
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 206,
    "downloadsCount": 216,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:21.900Z",
    "status": "published",
    "isCloudinary": true
  },
  {
    "_id": "6a7ace40d5451ff75dbc3d48",
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
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 394,
    "downloadsCount": 205,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:22.171Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7ace40d5451ff75dbc3d49",
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
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 126,
    "downloadsCount": 129,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:22.771Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7ace40d5451ff75dbc3d4a",
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
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 221,
    "downloadsCount": 186,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:22.868Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7ace42d5451ff75dbc3d4b",
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
    "fileUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786433184/codesphere/notes/wgjjxpqjux4by65npiln.pdf",
    "externalUrl": "https://res.cloudinary.com/ywik5ok0/image/upload/v1786433184/codesphere/notes/wgjjxpqjux4by65npiln.pdf",
    "uploadedBy": {
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 174,
    "downloadsCount": 177,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T07:26:24.953Z",
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
