/**
 * Swagger/OpenAPI Configuration
 * API Documentation setup
 */

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CodeSphere API',
      version: '1.0.0',
      description: 'CodeSphere - Interactive Ed-Tech Platform API Documentation',
      contact: {
        name: 'CodeSphere Team',
        email: 'support@codesphere.dev',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.codesphere.dev/api'
          : 'http://localhost:5000/api',
        description: process.env.NODE_ENV === 'production' ? 'Production' : 'Development',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Token for authentication. Use: Authorization: Bearer <token>',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            fullName: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['student', 'instructor', 'admin'] },
            avatar: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        SandboxProject: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            difficulty: { type: 'string', enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
            category: { type: 'string' },
            technologyStack: { type: 'array', items: { type: 'string' } },
            enrolledCount: { type: 'number' },
            completedCount: { type: 'number' },
            averageRating: { type: 'number' },
          },
        },
        CodeExecution: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Source code to execute' },
            language: { type: 'string', description: 'Programming language (javascript, python, java, etc)' },
            input: { type: 'string', description: 'Standard input (optional)' },
          },
          required: ['code', 'language'],
        },
        ExecutionResult: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            status: { type: 'object' },
            output: { type: 'string' },
            error: { type: 'string' },
            exitCode: { type: 'number' },
            executionTime: { type: 'number' },
            memory: { type: 'number' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    './routes/*.js', // Scan route files for JSDoc comments
  ],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
