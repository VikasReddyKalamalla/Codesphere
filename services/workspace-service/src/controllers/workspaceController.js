const containerManager = require('../services/containerManager');
const templateService = require('../services/templateService');

/**
 * POST /workspace/create
 * Body: { studentId, workspaceId, language, lessonId }
 */
async function createWorkspace(req, res) {
  try {
    const { studentId = 'student_demo', workspaceId, language = 'javascript' } = req.body;
    const wsId = workspaceId || `ws_${Date.now()}`;

    // Step 1: Copy starter template files to persistent host storage
    templateService.copyTemplateFiles(studentId, wsId, language);

    // Step 2: Spin up / start workspace container
    const wsInfo = await containerManager.createOrStartWorkspaceContainer(studentId, wsId, language);

    return res.status(200).json({
      success: true,
      message: 'Workspace created and started successfully',
      data: wsInfo
    });
  } catch (error) {
    console.error('[WorkspaceController] Create error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /workspace/start
 * Body: { workspaceId, studentId, language }
 */
async function startWorkspace(req, res) {
  try {
    const { workspaceId, studentId = 'student_demo', language = 'javascript' } = req.body;
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }

    const wsInfo = await containerManager.createOrStartWorkspaceContainer(studentId, workspaceId, language);

    return res.status(200).json({
      success: true,
      message: 'Workspace started',
      data: wsInfo
    });
  } catch (error) {
    console.error('[WorkspaceController] Start error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * POST /workspace/stop
 * Body: { workspaceId }
 */
async function stopWorkspace(req, res) {
  try {
    const { workspaceId } = req.body;
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }

    const result = await containerManager.stopWorkspaceContainer(workspaceId);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[WorkspaceController] Stop error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * DELETE /workspace
 * Query or Body: { workspaceId, removeFiles }
 */
async function deleteWorkspace(req, res) {
  try {
    const workspaceId = req.query.workspaceId || req.body.workspaceId;
    const removeFiles = req.query.removeFiles === 'true' || req.body.removeFiles === true;

    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }

    const result = await containerManager.deleteWorkspaceContainer(workspaceId, removeFiles);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('[WorkspaceController] Delete error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /workspace/status
 * Query: ?workspaceId=xyz
 */
async function getStatus(req, res) {
  try {
    const workspaceId = req.query.workspaceId || req.params.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }

    const status = containerManager.getWorkspaceStatus(workspaceId);
    return res.status(200).json({ success: true, data: status });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /workspace/url
 * Query: ?workspaceId=xyz
 */
async function getUrl(req, res) {
  try {
    const workspaceId = req.query.workspaceId || req.params.workspaceId;
    if (!workspaceId) {
      return res.status(400).json({ success: false, message: 'workspaceId is required' });
    }

    const status = containerManager.getWorkspaceStatus(workspaceId);
    return res.status(200).json({
      success: true,
      data: {
        workspaceId,
        url: status?.url || null,
        port: status?.port || null,
        status: status?.status || 'stopped'
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createWorkspace,
  startWorkspace,
  stopWorkspace,
  deleteWorkspace,
  getStatus,
  getUrl
};
