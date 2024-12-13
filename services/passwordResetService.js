const crypto = require('crypto');
const Token = require('../models/Token');
const User = require('../models/User');
const emailService = require('./emailService');
const bcrypt = require('bcrypt');

// Initiate password reset by generating a token and sending an email
exports.initiatePasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('No user found with this email');
  }

  // Generate a random token
  const token = crypto.randomBytes(32).toString('hex');

  // Save the token in the database
  const tokenDoc = new Token({
    userId: user._id,
    token,
  });
  await tokenDoc.save();

  // Send email to the user
  const resetUrl = `${process.env.FRONTEND_URL}/password-reset?token=${token}&id=${user._id}`;
  await emailService.sendMail(user.email, 'Password Reset', `Click the link to reset your password: ${resetUrl}`);

  return { message: 'Password reset link has been sent to your email.' };
};

// Reset password by validating the token and updating the user's password
exports.resetPassword = async (userId, token, newPassword) => {
  const tokenDoc = await Token.findOne({ userId, token });
  if (!tokenDoc) {
    throw new Error('Invalid or expired password reset token');
  }

  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update the user's password
  await User.findByIdAndUpdate(userId, { password: hashedPassword });

  // Delete the token after successful reset
  await Token.findByIdAndDelete(tokenDoc._id);

  return { message: 'Password has been reset successfully.' };
};
