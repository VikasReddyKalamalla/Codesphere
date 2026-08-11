const fs = require('fs');
const path = require('path');

const SEEDED_NOTES = [
  {
    "_id": "6a7a194170f375aa0f0743c7",
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
    "views": 334,
    "downloadsCount": 67,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.166Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7a194f70f375aa0f0743d0",
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
    "views": 343,
    "downloadsCount": 108,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.176Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7a195070f375aa0f0743d3",
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
    "fileUrl": "/mock-resources-proxy/Flask%20Cheatsheet.pdf",
    "externalUrl": "/mock-resources-proxy/Flask%20Cheatsheet.pdf",
    "uploadedBy": {
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 108,
    "downloadsCount": 52,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.305Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7a196f70f375aa0f0743e7",
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
    "views": 297,
    "downloadsCount": 211,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.318Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7aba4e70f375aa0f07491d",
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
    "views": 231,
    "downloadsCount": 138,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.351Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7aba4e70f375aa0f074920",
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
    "views": 445,
    "downloadsCount": 178,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.377Z",
    "status": "published",
    "isCloudinary": false
  },
  {
    "_id": "6a7aba4e70f375aa0f074923",
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
    "fileUrl": "/mock-resources-proxy/Php%20Cheatsheet.pdf",
    "externalUrl": "/mock-resources-proxy/Php%20Cheatsheet.pdf",
    "uploadedBy": {
      "fullName": "Admin User",
      "avatar": ""
    },
    "views": 220,
    "downloadsCount": 243,
    "averageRating": 4.9,
    "createdAt": "2026-08-11T05:59:42.394Z",
    "status": "published",
    "isCloudinary": false
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
