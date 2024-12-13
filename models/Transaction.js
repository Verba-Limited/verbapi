const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Requesting user
  recipientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },  // Recipient user
  amount: { type: Number, required: true },
  type: { type: String, enum: ['debit', 'credit', 'request'], required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'declined', 'adjusted', 'postponed'],
    default: 'pending',
  },
  postponedDate: { type: Date },  // New field to store the postponed date
  adjustedAmount: { type: Number },  // Optional field for adjusted amount
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
