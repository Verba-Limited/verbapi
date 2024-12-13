const express = require('express');
const router = express.Router();
const passwordResetController = require('../controllers/passwordResetController');

// Route to initiate the password reset (send reset token)
router.post('/request-reset', passwordResetController.requestPasswordReset);

// Route to reset the password with token
router.post('/reset', passwordResetController.resetPassword);

module.exports = router;
