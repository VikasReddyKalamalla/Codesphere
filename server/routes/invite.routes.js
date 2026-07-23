const express = require('express');
const router  = express.Router();
const { sendInvite, acceptInvite, rejectInvite, getUserInvites } = require('../controllers/invite.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/',              protect, getUserInvites);
router.post('/',             protect, sendInvite);
router.put('/:id/accept',   protect, acceptInvite);
router.put('/:id/reject',   protect, rejectInvite);

module.exports = router;
