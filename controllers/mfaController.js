const mfaService = require('../services/mfaService');

exports.initiateMFA = async (req, res) => {
  try {
    const result = await mfaService.initiateMFA(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const result = await mfaService.verifyOTP(req.user.id, req.body.otp);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.initiateUserVerification = async (req, res) => {
  console.log('Initiate user verification', req);
  try {
    const result = await mfaService.initiateUserVerification(req.user.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.completeUserVerification = async (req, res) => {
  try {
    const result = await mfaService.completeUserVerification(req.user.id, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
