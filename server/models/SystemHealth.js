const mongoose = require('mongoose');

const systemHealthSchema = new mongoose.Schema(
  {
    // Snapshot timestamp (indexed for time-series queries)
    recordedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Services
    mongodb: {
      status: { type: String, enum: ['up', 'down', 'degraded'], default: 'up' },
      responseTimeMs: { type: Number, default: 0 },
    },
    api: {
      status: { type: String, enum: ['up', 'down', 'degraded'], default: 'up' },
      uptimeSeconds: { type: Number, default: 0 },
    },
    // System resources (values are percentages or MB)
    memory: {
      totalMb: { type: Number, default: 0 },
      usedMb: { type: Number, default: 0 },
      freeMb: { type: Number, default: 0 },
      usagePercent: { type: Number, default: 0, min: 0, max: 100 },
    },
    cpu: {
      usagePercent: { type: Number, default: 0, min: 0, max: 100 },
      loadAverage: [{ type: Number }],
    },
    // Application-level
    activeConnections: {
      type: Number,
      default: 0,
    },
    averageResponseTimeMs: {
      type: Number,
      default: 0,
    },
    // Overall health status
    overallStatus: {
      type: String,
      enum: ['healthy', 'degraded', 'critical'],
      default: 'healthy',
    },
  },
  {
    timestamps: true,
  }
);

const SystemHealth = mongoose.model('SystemHealth', systemHealthSchema);

module.exports = SystemHealth;
