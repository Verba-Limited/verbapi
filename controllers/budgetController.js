const budgetService = require('../services/budgetService');

exports.getMonthlyBudget = async (req, res) => {
  try {
    const result = await budgetService.calculateMonthlyBudget(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
