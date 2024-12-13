const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/send', authMiddleware, transactionController.sendMoney);
router.post('/request', authMiddleware, transactionController.requestMoney);
router.post('/request/:transactionId/accept', authMiddleware, transactionController.acceptMoneyRequest);
router.post('/request/:transactionId/decline', authMiddleware, transactionController.declineMoneyRequest);
router.post('/request/:transactionId/adjust', authMiddleware, transactionController.adjustMoneyRequest);
router.post('/request/:transactionId/postpone', authMiddleware, transactionController.postponeMoneyRequest);
router.get('/history', authMiddleware, transactionController.getFilteredTransactions);

module.exports = router;
