const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/monthly', authMiddleware, budgetController.getMonthlyBudget);

module.exports = router;
