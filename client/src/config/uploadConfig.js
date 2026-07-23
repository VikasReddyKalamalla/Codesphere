export const UPLOAD_CONFIG = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_PDF_TYPES: ['application/pdf'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm'],
  MAX_IMAGE_SIZE: 2 * 1024 * 1024,
  MAX_VIDEO_SIZE: 50 * 1024 * 1024,
  MAX_PDF_SIZE: 5 * 1024 * 1024
};
export default UPLOAD_CONFIG;
