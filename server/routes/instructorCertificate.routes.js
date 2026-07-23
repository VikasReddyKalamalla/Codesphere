const express = require('express');
const router  = express.Router();

const {
  getIssuedCertificates,
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
} = require('../controllers/instructorCertificate.controller');

const { protect }    = require('../middlewares/auth.middleware');
const { restrictTo } = require('../middlewares/role.middleware');

// Public verification endpoint (no auth required)
router.get('/verify/:certificateNumber', verifyCertificate);

// Authenticated instructor endpoints
router.get('/',     protect, restrictTo('instructor', 'admin'), getIssuedCertificates);
router.post('/',    protect, restrictTo('instructor'), issueCertificate);
router.delete('/:id', protect, restrictTo('instructor'), revokeCertificate);

module.exports = router;
