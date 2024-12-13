const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  billerId: { type: String, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true }, // Due date for the bill
  status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  reminderSent: { type: Boolean, default: false }, // Track if reminder was sent
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);

