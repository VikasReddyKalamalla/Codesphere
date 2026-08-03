const WorkspaceCloud = require('../../../../server/models/WorkspaceCloud');

/**
 * Increment workspace analytics metrics
 */
async function trackWorkspaceEvent(workspaceId, eventType, increment = 1) {
  if (!workspaceId) return;

  const update = {};
  if (eventType === 'compile') update['analytics.compileCount'] = increment;
  else if (eventType === 'error') update['analytics.runtimeErrors'] = increment;
  else if (eventType === 'time_spent') update['analytics.timeSpentSeconds'] = increment;
  else if (eventType === 'file_created') update['analytics.filesCreatedCount'] = increment;
  else if (eventType === 'hint') update['analytics.hintsUsedCount'] = increment;
  else if (eventType === 'ai_message') update['analytics.aiMessagesCount'] = increment;

  try {
    await WorkspaceCloud.findByIdAndUpdate(workspaceId, { $inc: update });
  } catch (e) {}
}

module.exports = {
  trackWorkspaceEvent
};
