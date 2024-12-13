const accountService = require('../services/accountService');

exports.getBalance = async (req, res) => {
  try {
    console.log("req user: " + JSON.stringify(req.user));
    const result = await accountService.getAccountBalance(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBalance = async (req, res) => {
  const { amount, type } = req.body;
  try {
    const result = await accountService.updateAccountBalance(req.user.id, amount, type);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
