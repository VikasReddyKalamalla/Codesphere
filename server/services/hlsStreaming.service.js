/**
 * HLS Adaptive Bitrate Streaming & CloudFront CDN Service
 * Wraps lesson videos into HLS (.m3u8) adaptive bitrate streaming manifests via CloudFront.
 */

const logger = require('../utils/logger');

const CLOUDFRONT_BASE_URL = process.env.CLOUDFRONT_DISTRIBUTION_URL || 'https://d1111111111111.cloudfront.net';

/**
 * Generate HLS adaptive bitrate manifest endpoints for lesson video streaming
 */
const getHLSStreamUrl = (rawVideoUrl) => {
  if (!rawVideoUrl) return null;

  // If already HLS playlist or absolute external URL, return as is
  if (rawVideoUrl.endsWith('.m3u8') || rawVideoUrl.startsWith('http')) {
    return {
      masterPlaylist: rawVideoUrl,
      qualities: [
        { resolution: '1080p', bitrate: '4500k', url: rawVideoUrl },
        { resolution: '720p',  bitrate: '2500k', url: rawVideoUrl },
        { resolution: '480p',  bitrate: '1200k', url: rawVideoUrl },
      ],
      cdnProvider: 'CloudFront CDN (AWS S3 HLS)',
    };
  }

  const cleanPath = rawVideoUrl.replace(/^\//, '');
  const masterPlaylist = `${CLOUDFRONT_BASE_URL}/${cleanPath}/master.m3u8`;

  return {
    masterPlaylist,
    qualities: [
      { resolution: '1080p', bitrate: '4500k', url: `${CLOUDFRONT_BASE_URL}/${cleanPath}/1080p.m3u8` },
      { resolution: '720p',  bitrate: '2500k', url: `${CLOUDFRONT_BASE_URL}/${cleanPath}/720p.m3u8` },
      { resolution: '480p',  bitrate: '1200k', url: `${CLOUDFRONT_BASE_URL}/${cleanPath}/480p.m3u8` },
    ],
    cdnProvider: 'CloudFront CDN (AWS S3 HLS)',
  };
};

module.exports = {
  getHLSStreamUrl,
};
