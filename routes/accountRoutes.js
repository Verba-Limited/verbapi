const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const authMiddleware = require('../middlewares/authMiddleware');

// Protect routes with the authMiddleware
router.get('/balance', authMiddleware, accountController.getBalance);
router.post('/balance/update', authMiddleware, accountController.updateBalance);

module.exports = router;
