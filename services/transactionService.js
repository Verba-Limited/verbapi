const mongoose = require('mongoose');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const emailService = require('./emailService');
const redisClient = require('../config/redis');

exports.processSendMoney = async (userId, { recipientId, amount }) => {
  const session = await mongoose.startSession(); // Start a transaction
  session.startTransaction();

  try {
    const sender = await User.findById(userId).session(session);
    const recipient = await User.findById(recipientId).session(session);

    if (sender.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Debit sender and credit recipient
    sender.balance -= amount;
    recipient.balance += amount;
    
    await sender.save({ session });
    await recipient.save({ session });

    await session.commitTransaction(); // Commit if all goes well
    session.endSession();

    await redisClient.set(`balance_${userId}`, sender.balance, 'EX', 60 * 5);
    await redisClient.set(`balance_${recipientId}`, recipient.balance, 'EX', 60 * 5);

    return { message: "Money sent successfully" };
  } catch (error) {
    await session.abortTransaction(); // Rollback in case of error
    session.endSession();
    throw error;
  }
};

exports.processRequestMoney = async (userId, { recipientId, amount, description }) => {
  const user = await User.findById(userId);
  const recipient = await User.findById(recipientId);

  if (!user || !recipient) {
    throw new Error('User or recipient not found');
  }

  if (user.id === recipientId) {
    throw new Error('You cannot request money from yourself');
  }

  if (amount <= 0) {
    throw new Error('Invalid amount');
  }

  // Create a transaction record with type 'request'
  const transaction = new Transaction({
    userId,  // The user who is requesting the money
    recipientId,  // The recipient from whom money is requested
    amount,
    type: 'request',
    status: 'pending',
    description: description || `Requesting ${amount} from ${recipient.email}`
  });

  await transaction.save();

  // Send a notification to the recipient (e.g., email)
  const message = `${user.email} has requested ₦${amount} from you. Please review the request and take action.`;
  await emailService.sendMail(recipient.email, 'Money Request', message);

  return { message: 'Money request sent successfully', transaction };
};


// Accept the money request
exports.acceptMoneyRequest = async (recipientId, transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.recipientId.toString() !== recipientId.toString()) {
    throw new Error('Transaction not found or you are not authorized');
  }

  if (transaction.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  const sender = await User.findById(transaction.userId);
  const recipient = await User.findById(recipientId);

  if (!sender || !recipient) {
    throw new Error('User not found');
  }

  if (recipient.balance < transaction.amount) {
    throw new Error('Insufficient balance to fulfill this request');
  }

  // Transfer the amount
  recipient.balance -= transaction.amount;
  sender.balance += transaction.amount;

  await recipient.save();
  await sender.save();

  // Update transaction status to completed
  transaction.status = 'completed';
  await transaction.save();

  await redisClient.set(`balance_${sender.id}`, sender.balance, 'EX', 60 * 5);
  await redisClient.set(`balance_${recipientId}`, recipient.balance, 'EX', 60 * 5);

  // Notify sender about the acceptance
  await emailService.sendMail(sender.email, 'Money Request Accepted', `Your request for ₦${transaction.amount} has been accepted and transferred.`);

  return { message: 'Money request accepted and funds transferred', transaction };
};

// Decline the money request
exports.declineMoneyRequest = async (recipientId, transactionId) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.recipientId.toString() !== recipientId.toString()) {
    throw new Error('Transaction not found or you are not authorized');
  }

  if (transaction.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  // Update the transaction status to declined
  transaction.status = 'declined';
  await transaction.save();

  // Notify sender about the decline
  const sender = await User.findById(transaction.userId);
  await emailService.sendMail(sender.email, 'Money Request Declined', `Your request for ₦${transaction.amount} has been declined.`);

  return { message: 'Money request declined', transaction };
};

// Adjust the money request amount and accept
exports.adjustMoneyRequest = async (recipientId, transactionId, adjustedAmount) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.recipientId.toString() !== recipientId.toString()) {
    throw new Error('Transaction not found or you are not authorized');
  }

  if (transaction.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  const sender = await User.findById(transaction.userId);
  const recipient = await User.findById(recipientId);

  if (!sender || !recipient) {
    throw new Error('User not found');
  }

  if (recipient.balance < adjustedAmount) {
    throw new Error('Insufficient balance to fulfill this request');
  }

  // Transfer the adjusted amount
  recipient.balance -= adjustedAmount;
  sender.balance += adjustedAmount;

  await recipient.save();
  await sender.save();

  // Update the transaction status to adjusted and completed
  transaction.status = 'adjusted';
  transaction.adjustedAmount = adjustedAmount;
  await transaction.save();

  await redisClient.set(`balance_${sender.id}`, sender.balance, 'EX', 60 * 5);
  await redisClient.set(`balance_${recipientId}`, recipient.balance, 'EX', 60 * 5);

  // Notify sender about the adjustment and acceptance
  await emailService.sendMail(sender.email, 'Money Request Adjusted and Accepted', `Your request has been adjusted to ₦${adjustedAmount} and the money has been transferred.`);

  return { message: 'Money request adjusted and accepted', transaction };
};

// Postpone the money request decision
exports.postponeMoneyRequest = async (recipientId, transactionId, postponedDate) => {
  const transaction = await Transaction.findById(transactionId);
  if (!transaction || transaction.recipientId.toString() !== recipientId.toString()) {
    throw new Error('Transaction not found or you are not authorized');
  }

  if (transaction.status !== 'pending') {
    throw new Error('This request has already been processed');
  }

  // Set the postponed date and mark the status as postponed
  transaction.postponedDate = new Date(postponedDate);
  transaction.status = 'postponed';
  await transaction.save();

  return { message: 'Money request postponed until ' + postponedDate, transaction };
};

exports.getFilteredTransactions = async (userId, filters) => {
  const query = { userId };

  // Filter by transaction type (debit/credit)
  if (filters.type) {
    query.type = filters.type;
  }

  // Filter by date range (startDate and endDate)
  if (filters.startDate && filters.endDate) {
    query.createdAt = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  // Filter by amount range (minAmount and maxAmount)
  if (filters.minAmount && filters.maxAmount) {
    query.amount = {
      $gte: filters.minAmount,
      $lte: filters.maxAmount,
    };
  }

  // Retrieve filtered transactions
  const transactions = await Transaction.find(query).sort({ createdAt: -1 }); // Sorting by latest transactions
  return transactions;
};
