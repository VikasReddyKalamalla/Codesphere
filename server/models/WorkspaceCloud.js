const mongoose = require('mongoose');

const snapshotSchema = new mongoose.Schema({
  snapshotId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  diskPath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const aiMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'ai'], required: true },
  text: { type: String, required: true },
  codeSnippet: { type: String, default: '' },
  context: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

const envVarSchema = new mongoose.Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  isSecret: { type: Boolean, default: false }
});

const extensionSchema = new mongoose.Schema({
  extensionId: { type: String, required: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, default: true }
});

const annotationSchema = new mongoose.Schema({
  file: { type: String, required: true },
  line: { type: Number, required: true },
  comment: { type: String, required: true },
  instructorName: { type: String, default: 'Instructor' },
  createdAt: { type: Date, default: Date.now }
});

const workspaceCloudSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath',
      default: null
    },
    lessonId: {
      type: String,
      default: null,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'php', 'html', 'css'],
      default: 'javascript'
    },
    templateType: {
      type: String,
      enum: ['react_starter', 'fastapi', 'spring_boot', 'dsa_playground', 'node_express', 'python_basic', 'java_basic', 'cpp_basic'],
      default: 'node_express'
    },
    mode: {
      type: String,
      enum: ['learning', 'exam'],
      default: 'learning'
    },
    examConfig: {
      timerMinutes: { type: Number, default: 60 },
      lockedFiles: { type: [String], default: ['test_cases.json', 'README.md'] },
      autoSubmit: { type: Boolean, default: true },
      expiresAt: { type: Date, default: null }
    },
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['provisioning', 'running', 'stopped', 'archived', 'error'],
      default: 'provisioning',
      index: true
    },
    containerId: {
      type: String,
      default: null
    },
    port: {
      type: Number,
      default: null
    },
    previewSlug: {
      type: String,
      default: null
    },
    storagePath: {
      type: String,
      required: true
    },
    previewPorts: {
      type: [Number],
      default: [3000, 5000, 5173, 8080]
    },
    resourceLimits: {
      cpus: { type: Number, default: 1.0 },
      memoryMb: { type: Number, default: 1024 }
    },
    environmentVars: [envVarSchema],
    curatedExtensions: [extensionSchema],
    instructorAnnotations: [annotationSchema],
    activeTabs: { type: [String], default: [] },
    snapshots: [snapshotSchema],
    gitConfig: {
      repoUrl: { type: String, default: '' },
      branch: { type: String, default: 'main' },
      lastCommit: { type: String, default: '' }
    },
    aiHistory: [aiMessageSchema],
    analytics: {
      compileCount: { type: Number, default: 0 },
      runtimeErrors: { type: Number, default: 0 },
      timeSpentSeconds: { type: Number, default: 0 },
      filesCreatedCount: { type: Number, default: 0 },
      hintsUsedCount: { type: Number, default: 0 },
      aiMessagesCount: { type: Number, default: 0 },
      testPassRate: { type: Number, default: 100 }
    },
    lastTelemetry: {
      cpuPercent: { type: Number, default: 0 },
      memoryMb: { type: Number, default: 0 },
      memoryPercent: { type: Number, default: 0 },
      activeProcesses: { type: Number, default: 1 }
    },
    lastOpened: {
      type: Date,
      default: Date.now
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

workspaceCloudSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('WorkspaceCloud', workspaceCloudSchema);
