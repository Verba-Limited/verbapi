const express = require('express');
const router = express.Router();
const mfaController = require('../controllers/mfaController');
const authMiddleware = require('../middlewares/authMiddleware');
const userMiddleware = require('../middlewares/userMiddleware');

router.post('/initiate', authMiddleware, mfaController.initiateMFA);
router.post('/verify', authMiddleware, mfaController.verifyOTP);

router.post('/initiate/user', userMiddleware.ifUser, mfaController.initiateUserVerification);
router.post('/verify/user', userMiddleware.ifUser, mfaController.completeUserVerification);

module.exports = router;
