const express = require('express');
const router = express.Router();
const { getMyOrganization, inviteMember, verifyUniversity } = require('../controllers/organization.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/my-org', protect, getMyOrganization);
router.post('/invite', protect, inviteMember);
router.post('/university/verify', protect, verifyUniversity);

module.exports = router;
