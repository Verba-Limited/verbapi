const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  bvn: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: false },
  address: { type: Object, required: false },
  selfie: { type: String, required: false },
  gender: { type: String, required: false },
  dateOfBirth: { type: String, required: false },
  balance: { type: Number, default: 0 },
  otp: { type: String, required: false },
  isVerified: { type: Boolean, required: false, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
