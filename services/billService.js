const Bill = require('../models/Bill');
const User = require('../models/User');

// Create a bill with a due date
exports.createBill = async (userId, billDetails) => {
  const { billerId, amount, dueDate } = billDetails;

  const bill = new Bill({
    userId,
    billerId,
    amount,
    dueDate,
    status: 'pending',
    reminderSent: false, // Set to false when a new bill is created
  });

  await bill.save();
  return bill;
};

exports.payBill = async (userId, billDetails) => {
  const { billerId, amount } = billDetails;
  
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.balance < amount) throw new Error('Insufficient balance to pay the bill');

  // Debit the user’s account
  user.balance -= amount;
  await user.save();

  // Create bill record
  const bill = new Bill({
    userId,
    billerId,
    amount,
    status: 'paid'
  });
  await bill.save();

  return { message: 'Bill paid successfully', bill };
};

exports.getBillHistory = async (userId) => {
  const bills = await Bill.find({ userId });
  return bills;
};
