const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const authMiddleware = require('../middlewares/authMiddleware');

// Route to create a new bill
router.post('/create', authMiddleware, billController.createBill);

router.post('/pay', authMiddleware, billController.payBill);
router.get('/history', authMiddleware, billController.getBillHistory);

module.exports = router;
