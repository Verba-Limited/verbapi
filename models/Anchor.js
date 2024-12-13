const mongoose = require('mongoose');

const anchorDataSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  email: { type: String, required: false },
  anchorUserData: { type: Object, required: false },
  anchorUserKYCData: { type: Object, required: false },
  anchorDepositAccountData: { type: Object, required: false },
}, { timestamps: true });

// const anchorDepositAccountSchema = new mongoose.Schema({
//     userId: { type: String, required: false },
//     email: { type: String, required: false },
//     anchorDepositAccountData: { type: Object, required: false },
// }, { timestamps: true });

module.exports = mongoose.model('AnchorData', anchorDataSchema);
