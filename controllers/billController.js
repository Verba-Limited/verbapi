const billService = require('../services/billService');

// Handle creating a new bill
exports.createBill = async (req, res) => {
  try {
    const result = await billService.createBill(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.payBill = async (req, res) => {
  try {
    const result = await billService.payBill(req.user.id, req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBillHistory = async (req, res) => {
  try {
    const bills = await billService.getBillHistory(req.user.id);
    res.status(200).json({ bills });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
