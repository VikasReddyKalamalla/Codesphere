const os = require('os');
const mongoose = require('mongoose');
const SystemHealth = require('../models/SystemHealth');

/**
 * Collect the current system health snapshot and persist it.
 */
const getSystemHealth = async () => {
  const startTime = process.hrtime();

  // MongoDB ping
  let mongoStatus = 'up';
  let mongoResponseMs = 0;
  try {
    const t0 = Date.now();
    await mongoose.connection.db.admin().ping();
    mongoResponseMs = Date.now() - t0;
  } catch {
    mongoStatus = 'down';
  }

  // API timing
  const [sec, ns] = process.hrtime(startTime);
  const apiResponseMs = Math.round(sec * 1000 + ns / 1e6);

  // Memory
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;

  const memory = {
    totalMb: Math.round(totalMem / 1024 / 1024),
    usedMb: Math.round(usedMem / 1024 / 1024),
    freeMb: Math.round(freeMem / 1024 / 1024),
    usagePercent: Math.round((usedMem / totalMem) * 100),
  };

  // CPU
  const loadAvg = os.loadavg();
  const cpuUsagePercent = Math.min(Math.round(loadAvg[0] * 10), 100);

  // Uptime
  const uptimeSeconds = Math.round(process.uptime());

  // Determine overall status
  let overallStatus = 'healthy';
  if (mongoStatus === 'down') overallStatus = 'critical';
  else if (memory.usagePercent > 90 || cpuUsagePercent > 90) overallStatus = 'degraded';

  const snapshot = {
    recordedAt: new Date(),
    mongodb: { status: mongoStatus, responseTimeMs: mongoResponseMs },
    api: { status: 'up', uptimeSeconds },
    memory,
    cpu: { usagePercent: cpuUsagePercent, loadAverage: loadAvg },
    averageResponseTimeMs: apiResponseMs,
    overallStatus,
  };

  // Persist the snapshot (cap stored records to last 100 for space efficiency)
  await SystemHealth.create(snapshot);

  const count = await SystemHealth.countDocuments();
  if (count > 100) {
    const oldest = await SystemHealth.find({}).sort({ recordedAt: 1 }).limit(count - 100);
    await SystemHealth.deleteMany({ _id: { $in: oldest.map((d) => d._id) } });
  }

  return snapshot;
};

/**
 * Get the last N health snapshots.
 */
const getHealthHistory = async (limit = 10) => {
  const history = await SystemHealth.find({})
    .sort({ recordedAt: -1 })
    .limit(Number(limit));

  return { history };
};

module.exports = { getSystemHealth, getHealthHistory };
