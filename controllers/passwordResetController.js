const passwordResetService = require('../services/passwordResetService');

// Handle request for password reset (email token)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await passwordResetService.initiatePasswordReset(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Handle password reset using the token
exports.resetPassword = async (req, res) => {
  const { userId, token, newPassword } = req.body;
  try {
    const result = await passwordResetService.resetPassword(userId, token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
