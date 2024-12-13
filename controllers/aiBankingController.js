const aiBankingService = require('../services/aiBankingService');

exports.aiBankingController = async (req, res) => {
  try {
    const result = await aiBankingService.getService(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};