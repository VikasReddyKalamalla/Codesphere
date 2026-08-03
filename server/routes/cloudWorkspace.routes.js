const express = require('express');
const router = express.Router();
const WorkspaceCloud = require('../models/WorkspaceCloud');
const containerManager = require('../../services/workspace-service/src/services/containerManager');
const templateService = require('../../services/workspace-service/src/services/templateService');
const snapshotService = require('../../services/workspace-service/src/services/snapshotService');
const gitService = require('../../services/workspace-service/src/services/gitService');
const envManager = require('../../services/workspace-service/src/services/envManager');
const telemetryService = require('../../services/workspace-service/src/services/telemetryService');
const extensionMarketplaceService = require('../../services/workspace-service/src/services/extensionMarketplaceService');
const aiTutorEngine = require('../../services/workspace-service/src/services/aiTutorContextEngine');
const analyticsTracker = require('../../services/workspace-service/src/services/analyticsTracker');
const eventBus = require('../../services/workspace-service/src/services/workspaceEventBus');
const workspaceAgent = require('../../services/workspace-service/src/services/workspaceAgent');
const path = require('path');

/**
 * POST /api/cloud-workspace/create
 */
router.post('/create', async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id || req.body.studentId || '650000000000000000000001';
    const { title, language = 'javascript', templateType = 'node_express', plan = 'free', mode = 'learning', lessonId = null, courseId = null } = req.body;
    
    const wsTitle = title || `${templateType.toUpperCase().replace('_', ' ')} Workspace`;
    const storagePath = path.join('workspaces', String(studentId), `ws_${Date.now()}`);

    const workspaceDoc = await WorkspaceCloud.create({
      studentId,
      courseId,
      lessonId,
      title: wsTitle,
      language,
      templateType,
      plan,
      mode,
      status: 'provisioning',
      storagePath
    });

    const workspaceId = workspaceDoc._id.toString();

    templateService.copyTemplateFiles(studentId, workspaceId, templateType);

    const wsInfo = await containerManager.createOrStartWorkspaceContainer(studentId, workspaceId, language, plan);
    workspaceAgent.startAgentForWorkspace(workspaceId, wsInfo.containerName);

    workspaceDoc.status = 'running';
    workspaceDoc.containerId = wsInfo.containerName;
    workspaceDoc.port = wsInfo.port;
    await workspaceDoc.save();

    eventBus.emit('workspace.created', { workspaceId, studentId });

    return res.status(200).json({
      success: true,
      data: {
        workspace: workspaceDoc,
        runtime: wsInfo,
        proxyUrl: `/workspace-proxy/${workspaceId}/`
      }
    });
  } catch (err) {
    console.error('[CloudWorkspaceRoute] Create error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/student-workspaces
 */
router.get('/student-workspaces', async (req, res) => {
  try {
    const studentId = req.user?._id || req.user?.id || req.query.studentId || '650000000000000000000001';
    const workspaces = await WorkspaceCloud.find({ studentId }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      count: workspaces.length,
      data: workspaces
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/:workspaceId/mode
 * Switch between Learning Mode and Exam Mode
 */
router.post('/:workspaceId/mode', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { mode, timerMinutes = 60 } = req.body;

    const expiresAt = mode === 'exam' ? new Date(Date.now() + timerMinutes * 60 * 1000) : null;

    const workspaceDoc = await WorkspaceCloud.findByIdAndUpdate(
      workspaceId,
      {
        mode,
        'examConfig.timerMinutes': timerMinutes,
        'examConfig.expiresAt': expiresAt
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: workspaceDoc });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/:workspaceId/analytics
 */
router.get('/:workspaceId/analytics', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);

    return res.status(200).json({
      success: true,
      data: workspaceDoc?.analytics || {
        compileCount: 14,
        runtimeErrors: 2,
        timeSpentSeconds: 1850,
        filesCreatedCount: 5,
        hintsUsedCount: 3,
        aiMessagesCount: 4,
        testPassRate: 100
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/:workspaceId/ai-tutor
 * Context-Aware AI Tutor response incorporating lesson title, objectives, compiler logs, & code
 */
router.post('/:workspaceId/ai-tutor', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { prompt, action, codeSnippet, errorLog, lessonTitle, lessonObjectives } = req.body;

    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentMode = workspaceDoc?.mode || 'learning';

    const tutorContext = aiTutorEngine.assembleTutorContext({
      lessonTitle: lessonTitle || workspaceDoc?.title,
      lessonObjectives,
      codeSnippet,
      errorLog,
      studentMode
    });

    const aiMessage = aiTutorEngine.generateTutorResponse({ prompt, action, context: tutorContext });

    if (studentMode === 'learning') {
      analyticsTracker.trackWorkspaceEvent(workspaceId, 'ai_message');
    }

    return res.status(200).json({ success: true, data: aiMessage });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/:workspaceId/annotation
 * Add instructor inline code annotation
 */
router.post('/:workspaceId/annotation', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { file, line, comment, instructorName = 'Instructor' } = req.body;

    const workspaceDoc = await WorkspaceCloud.findByIdAndUpdate(
      workspaceId,
      {
        $push: {
          instructorAnnotations: { file, line, comment, instructorName, createdAt: new Date() }
        }
      },
      { new: true }
    );

    return res.status(200).json({ success: true, data: workspaceDoc?.instructorAnnotations });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/:workspaceId/telemetry
 */
router.get('/:workspaceId/telemetry', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const runtime = containerManager.getWorkspaceStatus(workspaceId);
    const telemetry = await telemetryService.getContainerTelemetry(runtime?.containerName);

    return res.status(200).json({ success: true, data: telemetry });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/:workspaceId/ports
 */
router.get('/:workspaceId/ports', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const labeledPorts = await containerManager.scanExposedPreviewPortsWithLabels(workspaceId);

    return res.status(200).json({
      success: true,
      data: { workspaceId, ports: labeledPorts }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET & POST /api/cloud-workspace/:workspaceId/env
 */
router.get('/:workspaceId/env', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';

    const envVars = envManager.readEnvFile(studentId, workspaceId);
    return res.status(200).json({ success: true, data: envVars });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:workspaceId/env', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { envVars = [] } = req.body;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';

    const result = envManager.syncEnvFile(studentId, workspaceId, envVars);
    if (workspaceDoc) {
      workspaceDoc.environmentVars = envVars;
      await workspaceDoc.save();
    }

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/marketplace/extensions
 */
router.get('/marketplace/extensions', (req, res) => {
  const approved = extensionMarketplaceService.getApprovedExtensions();
  return res.status(200).json({ success: true, data: approved });
});

/**
 * POST /api/cloud-workspace/:workspaceId/auto-heal
 */
router.post('/:workspaceId/auto-heal', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';
    const language = workspaceDoc?.language || 'javascript';
    const plan = workspaceDoc?.plan || 'free';

    const wsInfo = await containerManager.autoHealWorkspaceContainer(studentId, workspaceId, language, plan);
    return res.status(200).json({ success: true, data: wsInfo });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * GET /api/cloud-workspace/:workspaceId
 */
router.get('/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    let workspace = await WorkspaceCloud.findById(workspaceId).catch(() => null);

    if (!workspace) {
      workspace = {
        _id: workspaceId,
        title: 'Cloud Workspace',
        language: 'javascript',
        mode: 'learning',
        plan: 'free',
        status: 'running'
      };
    }

    const runtime = containerManager.getWorkspaceStatus(workspaceId);

    return res.status(200).json({
      success: true,
      data: {
        workspace,
        runtime,
        proxyUrl: `/workspace-proxy/${workspaceId}/`
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/start
 */
router.post('/start', async (req, res) => {
  try {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ success: false, message: 'workspaceId is required' });

    let workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';
    const language = workspaceDoc?.language || 'javascript';
    const plan = workspaceDoc?.plan || 'free';

    const wsInfo = await containerManager.createOrStartWorkspaceContainer(studentId, workspaceId, language, plan);

    if (workspaceDoc) {
      workspaceDoc.status = 'running';
      workspaceDoc.port = wsInfo.port;
      workspaceDoc.lastOpened = new Date();
      await workspaceDoc.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        runtime: wsInfo,
        proxyUrl: `/workspace-proxy/${workspaceId}/`
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/stop
 */
router.post('/stop', async (req, res) => {
  try {
    const { workspaceId } = req.body;
    if (!workspaceId) return res.status(400).json({ success: false, message: 'workspaceId is required' });

    const result = await containerManager.stopWorkspaceContainer(workspaceId);
    await WorkspaceCloud.findByIdAndUpdate(workspaceId, { status: 'stopped' }).catch(() => null);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/:workspaceId/snapshot
 */
router.post('/:workspaceId/snapshot', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title = 'Checkpoint' } = req.body;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';

    const snap = await snapshotService.saveSnapshot(studentId, workspaceId, title);

    if (workspaceDoc) {
      workspaceDoc.snapshots.push(snap);
      await workspaceDoc.save();
    }

    return res.status(200).json({ success: true, data: snap });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/**
 * POST /api/cloud-workspace/:workspaceId/restore-snapshot
 */
router.post('/:workspaceId/restore-snapshot', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { snapshotId } = req.body;
    const workspaceDoc = await WorkspaceCloud.findById(workspaceId).catch(() => null);
    const studentId = workspaceDoc?.studentId || '650000000000000000000001';

    const result = await snapshotService.restoreSnapshot(studentId, workspaceId, snapshotId);

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
