const asyncHandler        = require('../utils/asyncHandler');
const { successResponse } = require('../utils/apiResponse');
const resourceService     = require('../services/resource.service');
const { broadcastDataChange } = require('../utils/realtimeBroadcast');

// GET /api/resources
const getAllResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getAllResources(req.query);
  return successResponse(res, 200, 'Resources fetched successfully', data);
});

// GET /api/resources/:id
const getResourceById = asyncHandler(async (req, res) => {
  const data = await resourceService.getResourceById(req.params.id);
  return successResponse(res, 200, 'Resource fetched successfully', data);
});

// POST /api/resources
const createResource = asyncHandler(async (req, res) => {
  const data = await resourceService.createResource(req.body, req.file, req.user._id);
  broadcastDataChange('resource', 'created', data);
  return successResponse(res, 201, 'Resource created successfully', data);
});

// PUT /api/resources/:id
const updateResource = asyncHandler(async (req, res) => {
  const data = await resourceService.updateResource(req.params.id, req.body, req.file, req.user._id, req.user.role);
  broadcastDataChange('resource', 'updated', data);
  return successResponse(res, 200, 'Resource updated successfully', data);
});

// DELETE /api/resources/:id
const deleteResource = asyncHandler(async (req, res) => {
  await resourceService.deleteResource(req.params.id, req.user._id, req.user.role);
  broadcastDataChange('resource', 'deleted', { id: req.params.id });
  return successResponse(res, 200, 'Resource deleted successfully');
});

// POST /api/resources/:id/like
const toggleLike = asyncHandler(async (req, res) => {
  const data = await resourceService.toggleLike(req.params.id, req.user._id);
  return successResponse(res, 200, 'Like toggled successfully', data);
});

// POST /api/resources/:id/rate
const rateResource = asyncHandler(async (req, res) => {
  const { value } = req.body;
  const data = await resourceService.rateResource(req.params.id, req.user._id, value);
  return successResponse(res, 200, 'Resource rated successfully', data);
});

// GET /api/resources/featured
const getFeaturedResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getFeaturedResources();
  return successResponse(res, 200, 'Featured resources fetched successfully', data);
});

// GET /api/resources/trending
const getTrendingResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getTrendingResources();
  return successResponse(res, 200, 'Trending resources fetched successfully', data);
});

// GET /api/resources/recommended
const getRecommendedResources = asyncHandler(async (req, res) => {
  const data = await resourceService.getRecommendedResources();
  return successResponse(res, 200, 'Recommended resources fetched successfully', data);
});

// POST /api/resources/:id/comments
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const data = await resourceService.addComment(req.params.id, req.user._id, req.user, text);
  return successResponse(res, 201, 'Comment added successfully', data);
});

// POST /api/resources/:id/download
const trackDownload = asyncHandler(async (req, res) => {
  const data = await resourceService.trackDownload(req.params.id);
  return successResponse(res, 200, 'Download tracked successfully', data);
});

// GET /api/resources/analytics
const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const data = await resourceService.getAnalyticsSummary();
  return successResponse(res, 200, 'Analytics summary fetched successfully', data);
});

// GET /api/resources/proxy-pdf?url=...
const proxyPdf = asyncHandler(async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).send('URL query parameter is required');
  }

  const decodedUrl = decodeURIComponent(targetUrl);
  const possibleFilename = decodeURIComponent(decodedUrl.split('/').pop().split('?')[0]);
  
  // 1. Try local disk lookup first (uploads/resource, uploads, notes)
  if (possibleFilename) {
    const candidatePaths = [
      require('path').join(__dirname, '../uploads/resource', possibleFilename),
      require('path').join(__dirname, '../uploads', possibleFilename),
      require('path').join(__dirname, '../../notes(resources)', possibleFilename),
    ];

    for (const localPath of candidatePaths) {
      if (require('fs').existsSync(localPath)) {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${possibleFilename}"`);
        res.setHeader('Access-Control-Allow-Origin', '*');
        return res.sendFile(localPath);
      }
    }
  }

  // 2. Try direct HTTP fetch
  try {
    const axios = require('axios');
    const response = await axios.get(targetUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/pdf,application/octet-stream,*/*',
      },
      timeout: 15000,
    });

    if (response.status === 200) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      return res.send(Buffer.from(response.data));
    }
  } catch (err) {
    console.warn(`[PDF Proxy Notice]: HTTP fetch failed for ${targetUrl} (${err.message}). Using resilient notes fallback.`);
  }

  // 3. Resilient fallback to authentic notes directory
  const fs = require('fs');
  const path = require('path');
  const notesFolder = path.join(__dirname, '../../notes(resources)');

  if (fs.existsSync(notesFolder)) {
    const files = fs.readdirSync(notesFolder).filter(f => f.endsWith('.pdf'));
    const cleanTarget = possibleFilename.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    let matchedFile = files.find(f => {
      const cleanF = f.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanTarget.includes(cleanF) || cleanF.includes(cleanTarget);
    });

    if (!matchedFile && files.length > 0) {
      matchedFile = files[0];
    }

    if (matchedFile) {
      const matchPath = path.join(notesFolder, matchedFile);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${matchedFile}"`);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.sendFile(matchPath);
    }
  }

  return res.status(404).send('Unable to render PDF preview inline');
});

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleLike,
  rateResource,
  getFeaturedResources,
  getTrendingResources,
  getRecommendedResources,
  addComment,
  trackDownload,
  getAnalyticsSummary,
  proxyPdf,
};
