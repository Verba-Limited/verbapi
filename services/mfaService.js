const otpGenerator = require('otp-generator');
const User = require('../models/User');
const emailService = require('./emailService');

exports.initiateMFA = async (userId) => {
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  // Save OTP to the user (you can store it in the database or in memory)
  user.otp = otp;
  await user.save();
  // Send the OTP via email
  await emailService.sendMail(user.email, 'Your OTP Code', `Your OTP code is ${otp}`);
  return { message: 'OTP sent to your registered email address' };
};

exports.verifyOTP = async (userId, otp) => {
  const user = await User.findById(userId);
  if (user.otp === otp) {
    user.otp = null; // Clear OTP after successful validation
    await user.save();
    return { message: 'OTP verified successfully' };
  } else {
    throw new Error('Invalid OTP');
  }
};

exports.initiateUserVerification = async (userId) => {
  const otp = otpGenerator.generate(4, { digits: true, upperCase: true, specialChars: false });
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  // Save OTP to the user (you can store it in the database or in memory)
  user.otp = otp;
  await user.save();
  // Send the OTP via email
  await emailService.sendMail(user.email, 'Your OTP Code', `Your OTP code is ${otp}`);
  return { message: 'OTP sent to your registered email address' };
};

exports.completeUserVerification = async (userId, { otp }) => {
  const user = await User.findById(userId);
  if (user.otp === otp) {
    user.otp = null; // Clear OTP after successful validation
    user.isVerified = true;
    await user.save();
    console.log('verified user', user);
    return { success: true, message: "User verified successfully", user };
  } else {
    throw new Error('Invalid OTP');
  }
};


