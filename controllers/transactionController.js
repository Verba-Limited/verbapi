const transactionService = require('../services/transactionService');
const notificationService = require('../services/notificationService');

exports.sendMoney = async (req, res) => {
  try {
    const result = await transactionService.processSendMoney(req.user.id, req.body);
    
    // Notify user about transaction
    notificationService.notifyTransaction({
      email: req.user.email,
      amount: req.body.amount,
      type: 'Send Money',
    });
    
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.requestMoney = async (req, res) => {
  try {
    const result = await transactionService.processRequestMoney(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Accept the money request
exports.acceptMoneyRequest = async (req, res) => {
  try {
    const result = await transactionService.acceptMoneyRequest(req.user.id, req.params.transactionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Decline the money request
exports.declineMoneyRequest = async (req, res) => {
  try {
    const result = await transactionService.declineMoneyRequest(req.user.id, req.params.transactionId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Adjust the money request and accept
exports.adjustMoneyRequest = async (req, res) => {
  try {
    const result = await transactionService.adjustMoneyRequest(req.user.id, req.params.transactionId, req.body.adjustedAmount);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Postpone the money request
exports.postponeMoneyRequest = async (req, res) => {
  const { postponedDate } = req.body;
  try {
    const result = await transactionService.postponeMoneyRequest(req.user.id, req.params.transactionId, postponedDate);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getFilteredTransactions = async (req, res) => {
    const userId = req.user.id;
    
    const filters = {
      type: req.query.type, // 'debit' or 'credit'
      startDate: req.query.startDate, // 'YYYY-MM-DD'
      endDate: req.query.endDate, // 'YYYY-MM-DD'
      minAmount: req.query.minAmount, // e.g., '100'
      maxAmount: req.query.maxAmount, // e.g., '1000'
    };
  
    try {
      const transactions = await transactionService.getFilteredTransactions(userId, filters);
      res.status(200).json({ transactions });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
